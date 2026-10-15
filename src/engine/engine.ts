// ============================================================================
// Keep & Court — Core Game Engine
// Pure, UI-agnostic. All state transitions go through these functions.
// Functions mutate a draft GameState passed in; the store wraps them with
// immutable copies, so these can be called freely during AI simulation too.
// ============================================================================

import { ALL_CARDS, EDICTS, KEEP_CARDS, COURT_CARDS, STARTER_EDICTS } from './cards'
import { scoreEdict } from './edicts'
import {
  applyEffectKey,
  advInfluence,
  isLeader,
  scoreCardEndgame,
  type EffectChoices,
} from './effects'
import { legalPlacements, neighbors, shieldsOf } from './grid'
import { mulberry32, shuffle } from './rng'
import type {
  CardDef,
  CellIndex,
  DeckId,
  GameConfig,
  GameState,
  LogEntry,
  PlacedCard,
  PlayerState,
  ScoreBreakdown,
  ShieldColor,
} from './types'
import { SHIELD_COLORS, TOTAL_ROUNDS } from './types'

// ---------------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------------

export function createGame(config: GameConfig): GameState {
  const seed = config.seed >>> 0
  const rand = mulberry32(seed)

  const keepDeck = shuffle(KEEP_CARDS, rand)
  const courtDeck = shuffle(COURT_CARDS, rand)

  const names = [...config.playerNames]
  const players: PlayerState[] = names.map((name, id) => ({
    id,
    name,
    isAutoma: config.automa && id === names.length - 1 && name === 'Steward',
    coins: names.length <= 2 ? 12 : 10,
    keys: 2,
    grid: Array(9).fill(null),
    nextBuyDiscount: 0,
    bankedVP: 0,
  }))

  // Market: 3 from each deck.
  const market = {
    Keep: [keepDeck.shift()!, keepDeck.shift()!, keepDeck.shift()!] as (CardDef | null)[],
    Court: [courtDeck.shift()!, courtDeck.shift()!, courtDeck.shift()!] as (CardDef | null)[],
  }

  // Edicts: starter set for first game feel; could randomize via config later.
  const edicts = STARTER_EDICTS.map((id) => EDICTS.find((e) => e.id === id)!)

  const influence = {} as Record<ShieldColor, number[]>
  for (const c of SHIELD_COLORS) influence[c] = players.map(() => 0)

  const g: GameState = {
    players,
    current: 0,
    phase: 'awaitingBuy',
    round: 1,
    era: 1,
    herald: 'Court', // commons go first
    market,
    decks: { Keep: keepDeck, Court: courtDeck },
    discards: { Keep: [], Court: [] },
    influence,
    edicts,
    pendingPlacement: null,
    usedMarketActionThisTurn: false,
    chamberlain: 0,
    log: [],
    seed,
    rngState: Math.floor(rand() * 0xffffffff),
    config,
  }
  pushLog(g, 'system', `Game started. Seed ${seed}. ${players.length} players.`)
  return g
}

// ---------------------------------------------------------------------------
// Logging + RNG continuation
// ---------------------------------------------------------------------------

function pushLog(g: GameState, kind: LogEntry['kind'], text: string): void {
  g.log.push({ round: g.round, kind, text })
  if (g.log.length > 400) g.log.shift()
}

function rngNext(g: GameState): () => number {
  const r = mulberry32(g.rngState)
  // Advance stored state so subsequent draws differ and remain reproducible.
  g.rngState = Math.floor(r() * 0xffffffff)
  return mulberry32(g.rngState)
}

// ---------------------------------------------------------------------------
// Market actions (turn Step 1)
// ---------------------------------------------------------------------------

export function canUseMarketAction(g: GameState): boolean {
  return (
    g.phase === 'awaitingBuy' &&
    !g.usedMarketActionThisTurn &&
    cur(g).keys >= 1
  )
}

export function moveHeraldAction(g: GameState): void {
  if (!canUseMarketAction(g)) return
  cur(g).keys -= 1
  g.herald = g.herald === 'Keep' ? 'Court' : 'Keep'
  g.usedMarketActionThisTurn = true
  pushLog(g, 'system', `${cur(g).name} spent a key to move the Herald to ${g.herald}.`)
}

export function refreshRowAction(g: GameState): void {
  if (!canUseMarketAction(g)) return
  cur(g).keys -= 1
  const deck = g.herald
  // Discard current row, deal fresh.
  for (const card of g.market[deck]) if (card) g.discards[deck].push(card)
  g.market[deck] = [null, null, null]
  refillRow(g, deck)
  g.usedMarketActionThisTurn = true
  pushLog(g, 'system', `${cur(g).name} spent a key to refresh the ${deck} row.`)
}

// ---------------------------------------------------------------------------
// Buying (turn Step 2)
// ---------------------------------------------------------------------------

export function affordableIndices(g: GameState): number[] {
  const p = cur(g)
  const row = g.market[g.herald]
  const out: number[] = []
  row.forEach((card, i) => {
    if (card && effectiveCost(p, card) <= p.coins) out.push(i)
  })
  return out
}

export function effectiveCost(p: PlayerState, card: CardDef): number {
  return Math.max(0, card.cost - p.nextBuyDiscount)
}

/** True if the player cannot buy any card in the herald row (forces Vagabond). */
export function mustGoVagabond(g: GameState): boolean {
  return affordableIndices(g).length === 0
}

/** Buy a face-up card at market slot (deck, index). */
export function buyCard(g: GameState, deck: DeckId, index: number): boolean {
  if (g.phase !== 'awaitingBuy') return false
  if (deck !== g.herald) return false // must buy from herald row (normal case)
  const card = g.market[deck][index]
  if (!card) return false
  const p = cur(g)
  const cost = effectiveCost(p, card)
  if (cost > p.coins) return false

  p.coins -= cost
  p.nextBuyDiscount = 0 // discount consumed by this buy
  g.market[deck][index] = null
  g.pendingPlacement = { def: card, faceDown: false }
  g.phase = 'awaitingPlacement'
  pushLog(g, 'buy', `${p.name} bought ${card.name} (${cost}🪙).`)
  return true
}

/** Forced fallback: take any market card face down, gain +5 coins, +2 keys. */
export function takeVagabond(g: GameState, deck: DeckId, index: number): boolean {
  if (g.phase !== 'awaitingBuy') return false
  const card = g.market[deck][index]
  if (!card) return false
  const p = cur(g)
  g.market[deck][index] = null
  p.coins += 5
  p.keys += 2
  g.pendingPlacement = { def: card, faceDown: true }
  g.phase = 'awaitingPlacement'
  pushLog(g, 'buy', `${p.name} took ${card.name} face-down (+5🪙 +2🗝️).`)
  return true
}

// ---------------------------------------------------------------------------
// Placement (turn Steps 3-7)
// ---------------------------------------------------------------------------

export function legalCells(g: GameState): CellIndex[] {
  return legalPlacements(cur(g).grid)
}

export function placeCard(
  g: GameState,
  cell: CellIndex,
  choices?: EffectChoices,
): boolean {
  if (g.phase !== 'awaitingPlacement' || !g.pendingPlacement) return false
  if (!legalCells(g).includes(cell)) return false

  const p = cur(g)
  const placed: PlacedCard = {
    def: g.pendingPlacement.def,
    faceDown: g.pendingPlacement.faceDown,
    cell,
  }
  p.grid[cell] = placed
  g.pendingPlacement = null
  pushLog(g, 'place', `${p.name} placed ${placed.def.name}${placed.faceDown ? ' (face down)' : ''} at cell ${cell}.`)

  // Step 4: raise influence per shield (face up only).
  if (!placed.faceDown) {
    for (const s of placed.def.shields) advInfluence(g, p.id, s)
  }

  // Step 5: instant effect.
  if (!placed.faceDown) {
    applyEffectKey(placed.def.onHire, {
      g,
      player: p,
      placed,
      choices,
      log: (t) => pushLog(g, 'effect', t),
    })
    // Step 6: forced herald move printed on the card.
    if (placed.def.moveHeraldTo) g.herald = placed.def.moveHeraldTo
  }

  // Step 7: refill rows.
  refillRow(g, 'Keep')
  refillRow(g, 'Court')

  // Advance turn.
  endTurn(g, choices)
  return true
}

function refillRow(g: GameState, deck: DeckId): void {
  const row = g.market[deck]
  for (let i = 0; i < 3; i++) {
    if (row[i] === null) {
      if (g.decks[deck].length === 0 && g.discards[deck].length > 0) {
        const rand = rngNext(g)
        g.decks[deck] = shuffle(g.discards[deck], rand)
        g.discards[deck] = []
      }
      const card = g.decks[deck].shift()
      row[i] = card ?? null
    }
  }
}

// ---------------------------------------------------------------------------
// Turn / round progression
// ---------------------------------------------------------------------------

function endTurn(g: GameState, choices?: EffectChoices): void {
  g.usedMarketActionThisTurn = false
  const n = g.players.length
  const nextIndex = (g.current + 1) % n
  const roundComplete = nextIndex === g.chamberlain

  if (roundComplete) {
    heartbeat(g, choices)
    if (g.round % 3 === 0) scoreEraInfluence(g)
    if (g.round >= TOTAL_ROUNDS) {
      finalizeGame(g)
      return
    }
    g.round += 1
    g.era = (Math.ceil(g.round / 3) as 1 | 2 | 3)
  }
  g.current = nextIndex
  g.phase = 'awaitingBuy'

  // Automa plays automatically (influence only).
  if (cur(g).isAutoma) runAutomaTurn(g)
}

// ---------------------------------------------------------------------------
// The Heartbeat (end-of-round pulse)
// ---------------------------------------------------------------------------

function heartbeat(g: GameState, choices?: EffectChoices): void {
  pushLog(g, 'pulse', `💓 Heartbeat (round ${g.round}).`)
  for (const p of g.players) {
    if (p.isAutoma) continue
    // Resolve pulses in reading order a1..c3.
    for (let i = 0; i < 9; i++) {
      const placed = p.grid[i]
      if (!placed || placed.faceDown || !placed.def.pulse) continue
      applyEffectKey(placed.def.pulse, {
        g,
        player: p,
        placed,
        choices,
        log: (t) => pushLog(g, 'pulse', t),
      })
    }
  }
}

// ---------------------------------------------------------------------------
// Era Influence scoring (end of rounds 3, 6, 9)
// ---------------------------------------------------------------------------

export function scoreEraInfluence(g: GameState): void {
  const first = g.era * 2
  const second = g.era * 1
  for (const color of SHIELD_COLORS) {
    const vals = g.influence[color]
    const sorted = [...new Set(vals.filter((v) => v > 0))].sort((a, b) => b - a)
    if (sorted.length === 0) continue
    const firstVal = sorted[0]
    const secondVal = sorted[1]
    vals.forEach((v, id) => {
      if (v === firstVal) g.players[id].bankedVP += first
    })
    // Second place only if it's a distinct lower value.
    if (secondVal !== undefined) {
      vals.forEach((v, id) => {
        if (v === secondVal) g.players[id].bankedVP += second
      })
    }
  }
  pushLog(g, 'era', `Era ${g.era} Influence scored (1st=${first}, 2nd=${second} per track).`)
}

// ---------------------------------------------------------------------------
// Final scoring
// ---------------------------------------------------------------------------

export function finalizeGame(g: GameState): void {
  for (const p of g.players) {
    if (p.isAutoma) {
      p.score = emptyBreakdown()
      p.score.influence = 0 // handled via era scoring already into bankedVP
      p.score.banked = p.bankedVP
      p.score.total = p.bankedVP
      continue
    }
    p.score = scorePlayer(g, p)
  }
  g.phase = 'gameOver'
  const winner = [...g.players].sort(
    (a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0),
  )[0]
  pushLog(g, 'score', `Game over. ${winner.name} wins with ${winner.score?.total} VP.`)
}

function scorePlayer(g: GameState, p: PlayerState): ScoreBreakdown {
  // 1. Fill coffers greedily (largest capacity first for max storage).
  fillCoffers(p)

  const perCard: Record<number, number> = {}
  let cards = 0
  for (let i = 0; i < 9; i++) {
    const placed = p.grid[i]
    if (!placed) continue
    const vp = scoreCardEndgame(g, p, placed)
    perCard[i] = vp
    cards += vp
  }

  const keys = p.keys // 1 VP each

  const coffers = p.grid.reduce((acc, c) => acc + (c?.cofferCoins ?? 0), 0)

  // Era III influence was folded into bankedVP already at round 9's scoreEraInfluence.
  const banked = p.bankedVP

  const edictDetail = g.edicts.map((e) => ({
    id: e.id,
    name: e.name,
    vp: scoreEdict(g, p, e),
  }))
  const edicts = edictDetail.reduce((a, b) => a + b.vp, 0)

  const total = cards + keys + coffers + banked + edicts
  return {
    cards,
    keys,
    coffers,
    influence: 0,
    banked,
    edicts,
    total,
    perCard,
    edictDetail,
  }
}

/** Move the player's loose coins into coffers, largest capacity first. */
function fillCoffers(p: PlayerState): void {
  const coffers = p.grid
    .filter((c): c is PlacedCard => !!c && !c.faceDown && !!c.def.cofferCapacity)
    .sort((a, b) => (b.def.cofferCapacity ?? 0) - (a.def.cofferCapacity ?? 0))
  let remaining = p.coins
  for (const c of coffers) {
    const cap = c.def.cofferCapacity ?? 0
    const put = Math.min(cap, remaining)
    c.cofferCoins = put
    remaining -= put
  }
  p.coins = remaining // leftover loose coins (0 VP)
}

function emptyBreakdown(): ScoreBreakdown {
  return {
    cards: 0,
    keys: 0,
    coffers: 0,
    influence: 0,
    banked: 0,
    edicts: 0,
    total: 0,
    perCard: {},
    edictDetail: [],
  }
}

// ---------------------------------------------------------------------------
// Automa (solo opponent) — influence only
// ---------------------------------------------------------------------------

function runAutomaTurn(g: GameState): void {
  const p = cur(g)
  const diff = g.config.automaDifficulty
  // Alternate decks each round (Keep on odd rounds).
  const deck: DeckId = g.round % 2 === 1 ? 'Keep' : 'Court'
  const rand = rngNext(g)
  const pool = g.decks[deck].length > 0 ? g.decks[deck] : ALL_CARDS
  const flip = pool[Math.floor(rand() * pool.length)]
  const colors = [...flip.shields]
  if (diff === 'easy') {
    // Advance only the lowest-shown color.
    const sorted = colors.sort(
      (a, b) => g.influence[a][p.id] - g.influence[b][p.id],
    )
    advInfluence(g, p.id, sorted[0])
  } else {
    for (const c of colors) advInfluence(g, p.id, c)
    if (diff === 'hard') {
      // +1 on the color the automa currently leads most.
      const best = [...SHIELD_COLORS].sort(
        (a, b) => g.influence[b][p.id] - g.influence[a][p.id],
      )[0]
      advInfluence(g, p.id, best)
    }
  }
  pushLog(g, 'system', `Steward advanced influence (${colors.join(',')}).`)
  // Automa takes no placement; immediately end its turn.
  g.pendingPlacement = null
  endTurn(g)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function cur(g: GameState): PlayerState {
  return g.players[g.current]
}

/** Convenience: current influence standings for UI. */
export function standings(g: GameState): Record<ShieldColor, number[]> {
  return g.influence
}

export { isLeader, neighbors, shieldsOf }
