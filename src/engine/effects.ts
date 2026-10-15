// ============================================================================
// Effect resolution. Each card's onHire/pulse/endgame is a small string key
// (optionally parameterized). We parse and apply them against GameState.
//
// Design rule: the printed card text (these keys) overrides general rules.
// Keys may be chained with '|' for cards that do multiple things.
// ============================================================================

import {
  CENTER,
  CORNERS,
  EDGES,
  cellsInCol,
  cellsInRow,
  colOf,
  countColor,
  distinctColors,
  neighbors,
  rowOf,
  shieldsOf,
} from './grid'
import type {
  CellIndex,
  GameState,
  PlacedCard,
  PlayerState,
  ShieldColor,
} from './types'
import { INFLUENCE_MAX, SHIELD_COLORS } from './types'

// ---- Influence helpers ----------------------------------------------------

export function advInfluence(
  g: GameState,
  playerId: number,
  color: ShieldColor,
  by = 1,
): void {
  const cur = g.influence[color][playerId]
  g.influence[color][playerId] = Math.min(INFLUENCE_MAX, cur + by)
}

/** Players (ids) who are strictly 1st / tied-1st on a track. */
export function leadersOf(g: GameState, color: ShieldColor): number[] {
  const vals = g.influence[color]
  const max = Math.max(...vals)
  if (max <= 0) return []
  const out: number[] = []
  vals.forEach((v, id) => {
    if (v === max) out.push(id)
  })
  return out
}

export function isLeader(
  g: GameState,
  playerId: number,
  color: ShieldColor,
): boolean {
  return leadersOf(g, color).includes(playerId)
}

function leaderTrackCount(g: GameState, playerId: number): number {
  let n = 0
  for (const c of SHIELD_COLORS) if (isLeader(g, playerId, c)) n++
  return n
}

// ---- Context for an effect resolution -------------------------------------

export interface EffectCtx {
  g: GameState
  player: PlayerState
  /** The card triggering (for pulse/endgame) or just placed (onHire). */
  placed: PlacedCard
  /** For onHire interactive choices; the UI/AI provides these. */
  choices?: EffectChoices
  log: (text: string) => void
}

/** Optional pre-resolved choices supplied by UI/AI (keeps engine deterministic). */
export interface EffectChoices {
  /** Color to advance for 'advInfluenceAny' / Spire Watch etc. */
  influenceColor?: ShieldColor
  /** Two colors for 'advTwoInfluence'. */
  influenceTwo?: [ShieldColor, ShieldColor]
  /** Color to name for Inquisitor/Agitator. */
  namedColor?: ShieldColor
  /** Whether to discard a peeked deck top ('Keep'|'Court'|null). */
  peekDiscard?: 'Keep' | 'Court' | null
  /** Whether to move the herald when a card says 'may move'. */
  moveHerald?: boolean
}

// ---------------------------------------------------------------------------
// Instant (onHire) + per-round (pulse) resolution
// ---------------------------------------------------------------------------

export function applyEffectKey(key: string | undefined, ctx: EffectCtx): void {
  if (!key) return
  for (const part of key.split('|')) applyOne(part.trim(), ctx)
}

function applyOne(part: string, ctx: EffectCtx): void {
  const [name, ...args] = part.split(':')
  const { g, player, placed } = ctx
  const grid = player.grid

  switch (name) {
    case 'gainCoins':
      player.coins += num(args[0])
      break
    case 'gainKeys':
      player.keys += num(args[0])
      break
    case 'discountNext':
      player.nextBuyDiscount += num(args[0])
      break

    case 'coinsPerNeighborColor': {
      const color = args[0] as ShieldColor
      const n = neighbors(grid, placed.cell).reduce(
        (acc, p) => acc + shieldsOf(p).filter((s) => s === color).length,
        0,
      )
      player.coins += n * num(args[1])
      break
    }
    case 'coinsPerNeighbor': {
      const n = neighbors(grid, placed.cell).length
      player.coins += n * num(args[0])
      break
    }
    case 'coinsIfEdge':
      if (EDGES.includes(placed.cell)) player.coins += num(args[0])
      break
    case 'coinsIfNeighborColor': {
      const color = args[0] as ShieldColor
      if (neighbors(grid, placed.cell).some((p) => shieldsOf(p).includes(color)))
        player.coins += num(args[1])
      break
    }
    case 'coinsPerMarketColor': {
      const colors = new Set<ShieldColor>()
      for (const row of [g.market.Keep, g.market.Court])
        for (const card of row) if (card) card.shields.forEach((s) => colors.add(s))
      player.coins += colors.size * num(args[0])
      break
    }

    case 'gainKeyIfFew':
      if (player.keys < num(args[0])) player.keys += 1
      break

    case 'advInfluence':
      advInfluence(g, player.id, args[0] as ShieldColor)
      break
    case 'advInfluenceAny': {
      const color = ctx.choices?.influenceColor ?? bestInfluenceColor(ctx)
      advInfluence(g, player.id, color)
      break
    }
    case 'advTwoInfluence': {
      const two =
        ctx.choices?.influenceTwo ?? defaultTwoColors(ctx)
      advInfluence(g, player.id, two[0])
      advInfluence(g, player.id, two[1])
      break
    }

    case 'mayMoveHerald':
      if (ctx.choices?.moveHerald)
        g.herald = g.herald === 'Keep' ? 'Court' : 'Keep'
      break

    case 'opponentsLoseKeys': {
      const amt = num(args[0])
      for (const p of g.players)
        if (p.id !== player.id) p.keys = Math.max(0, p.keys - amt)
      break
    }
    case 'opponentsPayCoins': {
      const amt = num(args[0])
      for (const p of g.players)
        if (p.id !== player.id) {
          const pay = Math.min(amt, p.coins)
          p.coins -= pay
          player.coins += pay
        }
      break
    }
    case 'stealCoins': {
      const amt = num(args[0])
      for (const p of g.players)
        if (p.id !== player.id) {
          const pay = Math.min(amt, p.coins)
          p.coins -= pay
          player.coins += pay
        }
      break
    }
    case 'opponentsMissingColorPay': {
      const color = ctx.choices?.namedColor ?? bestNamedColorForInquisitor(ctx)
      const amt = num(args[0])
      for (const p of g.players)
        if (p.id !== player.id) {
          const has = p.grid.some((c) => shieldsOf(c).includes(color))
          if (!has) {
            const pay = Math.min(amt, p.coins)
            p.coins -= pay
            player.coins += pay
          }
        }
      break
    }

    case 'peekDecks': {
      const which = ctx.choices?.peekDiscard
      if (which && g.decks[which].length > 0) {
        const discarded = g.decks[which].shift()!
        g.discards[which].push(discarded)
      }
      break
    }

    default:
      // Unknown instant/pulse key — ignore safely (endgame keys handled elsewhere).
      break
  }
}

// ---------------------------------------------------------------------------
// End-game scoring per card. Returns VP (may be negative).
// ---------------------------------------------------------------------------

export function scoreCardEndgame(
  g: GameState,
  player: PlayerState,
  placed: PlacedCard,
): number {
  if (placed.faceDown) return 0
  const key = placed.def.endgame
  if (!key) return 0
  const [name, ...args] = key.split(':')
  const grid = player.grid
  const cell = placed.cell

  switch (name) {
    case 'coffer':
      return placed.cofferCoins ?? 0

    case 'cofferPlusNeighborColor': {
      const color = args[0] as ShieldColor
      const per = num(args[1])
      const nn = neighbors(grid, cell).filter((p) =>
        shieldsOf(p).includes(color),
      ).length
      return (placed.cofferCoins ?? 0) + nn * per
    }

    case 'vpIfAdjColor': {
      const color = args[0] as ShieldColor
      const has = neighbors(grid, cell).some((p) => shieldsOf(p).includes(color))
      return has ? num(args[1]) : 0
    }
    case 'vpPerColorInRow': {
      const color = args[0] as ShieldColor
      const cards = cellsInRow(rowOf(cell)).map((i) => grid[i])
      return countColor(cards, color) * num(args[1])
    }
    case 'vpPerColorInColumn': {
      const color = args[0] as ShieldColor
      const cards = cellsInCol(colOf(cell)).map((i) => grid[i])
      return countColor(cards, color) * num(args[1])
    }
    case 'vpPerColorInGrid': {
      const color = args[0] as ShieldColor
      return countColor(grid, color) * num(args[1])
    }
    case 'vpPerOtherAdjColor': {
      // 3⭐ per OTHER adjacent card of this color (count adjacent cards, not shields)
      const color = args[0] as ShieldColor
      const cnt = neighbors(grid, cell).filter((p) =>
        shieldsOf(p).includes(color),
      ).length
      return cnt * num(args[1])
    }
    case 'vpPerNeighborColor': {
      const color = args[0] as ShieldColor
      const cnt = neighbors(grid, cell).filter((p) =>
        shieldsOf(p).includes(color),
      ).length
      return cnt * num(args[1])
    }
    case 'vpPerNeighborColors': {
      const colors = args[0].split(',') as ShieldColor[]
      const per = num(args[1])
      let cnt = 0
      for (const p of neighbors(grid, cell))
        for (const c of colors) if (shieldsOf(p).includes(c)) cnt++
      return cnt * per
    }
    case 'vpPerNeighbor':
      return neighbors(grid, cell).length * num(args[0])
    case 'vpPerColorsInRow': {
      const cards = cellsInRow(rowOf(cell)).map((i) => grid[i])
      return distinctColors(cards).size * num(args[0])
    }
    case 'vpPerColorsInGrid':
      return distinctColors(grid).size * num(args[0])
    case 'vpPerColorInCross': {
      const color = args[0] as ShieldColor
      const set = new Set<number>([
        ...cellsInRow(rowOf(cell)),
        ...cellsInCol(colOf(cell)),
      ])
      const cards = [...set].map((i) => grid[i])
      return countColor(cards, color) * num(args[1])
    }
    case 'vpPerColumnWithColor': {
      const color = args[0] as ShieldColor
      let cols = 0
      for (let c = 0; c < 3; c++)
        if (countColor(cellsInCol(c).map((i) => grid[i]), color) > 0) cols++
      return cols * num(args[1])
    }
    case 'vpPerRowWithColor': {
      const color = args[0] as ShieldColor
      let rows = 0
      for (let r = 0; r < 3; r++)
        if (countColor(cellsInRow(r).map((i) => grid[i]), color) > 0) rows++
      return rows * num(args[1])
    }
    case 'vpPerCardInRow': {
      const cards = cellsInRow(rowOf(cell)).map((i) => grid[i]).filter(Boolean)
      return cards.length * num(args[0])
    }

    case 'vpIfCorner':
      return CORNERS.includes(cell) ? num(args[0]) : 0
    case 'vpIfCenter':
      return cell === CENTER ? num(args[0]) : 0
    case 'vpIfAdjCenter':
      return neighbors(grid, cell).length > 0 && isAdjacentToCenter(cell)
        ? num(args[0])
        : 0
    case 'vpIfTopRow':
      return rowOf(cell) === 0 ? num(args[0]) : 0
    case 'vpIfBottomRow':
      return rowOf(cell) === 2 ? num(args[0]) : 0
    case 'vpIfCell':
      return cell === (num(args[0]) as CellIndex) ? num(args[1]) : 0

    case 'vpPerKeyHeld':
      return Math.min(player.keys * num(args[0]), num(args[1]))
    case 'vpPerCoins':
      return Math.floor(player.coins / num(args[0])) * num(args[1])

    case 'vpIfLeaderTrack': {
      const color = args[0] as ShieldColor
      return isLeader(g, player.id, color) ? num(args[1]) : 0
    }
    case 'vpPerLeaderTrack':
      return leaderTrackCount(g, player.id) * num(args[0])

    case 'vpPerColorMinusColor': {
      const cPlus = args[0] as ShieldColor
      const plus = num(args[1])
      const cMinus = args[2] as ShieldColor
      const minus = num(args[3])
      return countColor(grid, cPlus) * plus - countColor(grid, cMinus) * minus
    }

    case 'vpIfNoSharedNeighbor': {
      const myColors = new Set(shieldsOf(placed))
      const shares = neighbors(grid, cell).some((p) =>
        shieldsOf(p).some((s) => myColors.has(s)),
      )
      return shares ? 0 : num(args[0])
    }

    default:
      return 0
  }
}

function isAdjacentToCenter(cell: number): boolean {
  return EDGES.includes(cell as CellIndex)
}

// ---- Simple AI/default choice helpers (deterministic) ---------------------

function bestInfluenceColor(ctx: EffectCtx): ShieldColor {
  // Advance the color the player already has the most shields of (greedy).
  const counts = SHIELD_COLORS.map(
    (c) => [c, countColor(ctx.player.grid, c)] as const,
  )
  counts.sort((a, b) => b[1] - a[1])
  return counts[0][0]
}

function defaultTwoColors(ctx: EffectCtx): [ShieldColor, ShieldColor] {
  const counts = SHIELD_COLORS.map(
    (c) => [c, countColor(ctx.player.grid, c)] as const,
  ).sort((a, b) => b[1] - a[1])
  return [counts[0][0], counts[1][0]]
}

function bestNamedColorForInquisitor(ctx: EffectCtx): ShieldColor {
  // Name a color most opponents lack → maximize payout.
  const { g, player } = ctx
  let best: ShieldColor = 'Az'
  let bestMissing = -1
  for (const c of SHIELD_COLORS) {
    let missing = 0
    for (const p of g.players)
      if (p.id !== player.id && !p.grid.some((x) => shieldsOf(x).includes(c)))
        missing++
    if (missing > bestMissing) {
      bestMissing = missing
      best = c
    }
  }
  return best
}

function num(s: string | undefined): number {
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

export { num as _num }
