// ============================================================================
// Keep & Court — Core Engine Types
// Pure TypeScript, no UI dependencies. The single source of truth for game data.
// ============================================================================

/** The six shield colors. Keep deck skews Az/Vi/Ve; Court deck skews Cr/Am/Go. */
export type ShieldColor = 'Az' | 'Vi' | 'Ve' | 'Cr' | 'Am' | 'Go'

export const SHIELD_COLORS: ShieldColor[] = ['Az', 'Vi', 'Ve', 'Cr', 'Am', 'Go']

export const SHIELD_META: Record<
  ShieldColor,
  { name: string; theme: string; hex: string; emoji: string }
> = {
  Az: { name: 'Azure', theme: 'Nobility', hex: '#2f6fed', emoji: '🔵' },
  Vi: { name: 'Violet', theme: 'Faith', hex: '#8b5cf6', emoji: '🟣' },
  Ve: { name: 'Verdant', theme: 'Scholarship', hex: '#1fab6b', emoji: '🟢' },
  Cr: { name: 'Crimson', theme: 'Military', hex: '#e23b4e', emoji: '🔴' },
  Am: { name: 'Amber', theme: 'Craft', hex: '#f08a24', emoji: '🟠' },
  Go: { name: 'Gold', theme: 'Commons', hex: '#eab308', emoji: '🟡' },
}

export type DeckId = 'Keep' | 'Court'

/** A grid cell index 0..8, laid out as:  0 1 2 / 3 4 5 / 6 7 8 (a1..c3). */
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/** Static card definition (from the roster). Immutable data. */
export interface CardDef {
  id: string
  name: string
  cost: number
  shields: ShieldColor[] // 1 or 2 entries
  deck: DeckId
  cofferCapacity?: number
  /** Herald move forced by this card after placement. */
  moveHeraldTo?: DeckId
  /** Short human text for each timing band (for UI tooltips). */
  text: { onHire?: string; pulse?: string; endgame?: string }
  /** Logic keys — the engine switches on these to run effects. */
  onHire?: EffectKey
  pulse?: EffectKey
  endgame?: EffectKey
  /** Numeric params some effects need (multipliers, caps, colors). */
  params?: Record<string, number | string | string[]>
}

/** Identifier the engine switches on to run a card's coded effect. */
export type EffectKey = string

/** A card as it sits in play (face up or down). */
export interface PlacedCard {
  def: CardDef
  faceDown: boolean
  cell: CellIndex
  /** Coins assigned into this card's coffer at end game (for display). */
  cofferCoins?: number
}

export interface PlayerState {
  id: number
  name: string
  isAutoma: boolean
  coins: number
  keys: number
  /** 3x3 grid; null = empty cell. Indexed 0..8. */
  grid: (PlacedCard | null)[]
  /** Discount in coins to apply to the player's NEXT buy (consumed once). */
  nextBuyDiscount: number
  /** VP earned during play (influence eras, pulse VP, etc.). */
  bankedVP: number
  /** Final score breakdown, filled at game end. */
  score?: ScoreBreakdown
}

export interface ScoreBreakdown {
  cards: number
  keys: number
  coffers: number
  influence: number
  edicts: number
  banked: number
  total: number
  /** Per-card VP, keyed by cell, for the UI replay/analysis. */
  perCard: Record<number, number>
  edictDetail: { id: string; name: string; vp: number }[]
}

export interface EdictDef {
  id: string
  name: string
  text: string
  /** Logic key the engine switches on. */
  score: EffectKey
  params?: Record<string, number | string | string[]>
}

export type Phase =
  | 'setup'
  | 'awaitingBuy' // player must pick a market card
  | 'awaitingPlacement' // player bought a card, must place it
  | 'gameOver'

export interface MarketState {
  Keep: (CardDef | null)[] // length 3
  Court: (CardDef | null)[] // length 3
}

export interface GameState {
  players: PlayerState[]
  current: number // index into players
  phase: Phase
  round: number // 1..9
  era: 1 | 2 | 3
  herald: DeckId
  market: MarketState
  decks: { Keep: CardDef[]; Court: CardDef[] }
  discards: { Keep: CardDef[]; Court: CardDef[] }
  /** Shared influence tracks: influence[color][playerId] = steps 0..12. */
  influence: Record<ShieldColor, number[]>
  edicts: EdictDef[]
  /** Card the current player bought and must now place. */
  pendingPlacement: { def: CardDef; faceDown: boolean } | null
  /** Whether the current player has used their once-per-turn market action. */
  usedMarketActionThisTurn: boolean
  /** Index of the player who starts the round (Chamberlain). */
  chamberlain: number
  /** Running human-readable log of notable events. */
  log: LogEntry[]
  /** RNG seed for reproducible/daily games. */
  seed: number
  rngState: number
  config: GameConfig
}

export interface GameConfig {
  playerNames: string[]
  automa: boolean
  automaDifficulty: 'easy' | 'normal' | 'hard'
  seed: number
}

export interface LogEntry {
  round: number
  text: string
  kind: 'buy' | 'place' | 'effect' | 'pulse' | 'era' | 'score' | 'system'
}

export const INFLUENCE_MAX = 12
export const GRID_SIZE = 9
export const TOTAL_ROUNDS = 9
