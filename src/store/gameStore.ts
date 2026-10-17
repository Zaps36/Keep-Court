// ============================================================================
// Zustand store wrapping the pure engine. We deep-clone before each mutation
// so React sees new references (engine functions mutate in place by design).
// Presentation-only state (avatars, animation ticks) lives here, not in the
// engine, so the engine stays portable.
// ============================================================================

import { create } from 'zustand'
import { playAITurn } from '../engine/ai'
import type { EffectChoices } from '../engine/effects'
import {
  buyCard as engineBuy,
  createGame,
  moveHeraldAction,
  placeCard as enginePlace,
  refreshRowAction,
  takeVagabond as engineVagabond,
} from '../engine/engine'
import type { CellIndex, DeckId, GameConfig, GameState } from '../engine/types'

interface Store {
  game: GameState | null
  aiPlayers: Set<number>
  /** Avatar sprite id per player index. */
  avatars: string[]
  pendingChoices: EffectChoices
  /** Grid cells of player 0 that pulsed on the latest heartbeat. */
  beatingCells: number[]
  /** True while a heartbeat banner is showing. */
  heartbeatRound: number | null

  newGame: (config: GameConfig, aiPlayers: number[], avatars: string[]) => void
  quit: () => void
  moveHerald: () => void
  refreshRow: () => void
  buy: (deck: DeckId, index: number) => void
  vagabond: (deck: DeckId, index: number) => void
  place: (cell: CellIndex) => void
  setChoices: (c: EffectChoices) => void
  runAITurns: () => void
}

const clone = (g: GameState): GameState => structuredClone(g)

/** Cells of player 0 holding a face-up card with a pulse power. */
function pulseCells(g: GameState): number[] {
  const p = g.players[0]
  if (!p) return []
  const out: number[] = []
  p.grid.forEach((c, i) => {
    if (c && !c.faceDown && c.def.pulse) out.push(i)
  })
  return out
}

export const useGame = create<Store>((set, get) => ({
  game: null,
  aiPlayers: new Set(),
  avatars: [],
  pendingChoices: {},
  beatingCells: [],
  heartbeatRound: null,

  newGame: (config, aiPlayers, avatars) => {
    set({
      game: createGame(config),
      aiPlayers: new Set(aiPlayers),
      avatars,
      pendingChoices: {},
      beatingCells: [],
      heartbeatRound: null,
    })
    setTimeout(() => get().runAITurns(), 300)
  },

  quit: () =>
    set({ game: null, beatingCells: [], heartbeatRound: null, pendingChoices: {} }),

  moveHerald: () => {
    const g = clone(get().game!)
    moveHeraldAction(g)
    set({ game: g })
  },

  refreshRow: () => {
    const g = clone(get().game!)
    refreshRowAction(g)
    set({ game: g })
  },

  buy: (deck, index) => {
    const g = clone(get().game!)
    engineBuy(g, deck, index)
    set({ game: g })
  },

  vagabond: (deck, index) => {
    const g = clone(get().game!)
    engineVagabond(g, deck, index)
    set({ game: g })
  },

  place: (cell) => {
    const before = get().game!
    const roundBefore = before.round
    const g = clone(before)
    enginePlace(g, cell, get().pendingChoices)

    // A heartbeat happened if the round advanced or the game just ended.
    const beat = g.round !== roundBefore || g.phase === 'gameOver'
    set({
      game: g,
      pendingChoices: {},
      beatingCells: beat ? pulseCells(g) : [],
      heartbeatRound: beat ? roundBefore : null,
    })
    if (beat) {
      setTimeout(() => set({ beatingCells: [], heartbeatRound: null }), 900)
    }
    setTimeout(() => get().runAITurns(), beat ? 950 : 420)
  },

  setChoices: (c) => set({ pendingChoices: { ...get().pendingChoices, ...c } }),

  runAITurns: () => {
    const step = () => {
      const state = get()
      const g = state.game
      if (!g || g.phase === 'gameOver') return
      const isAI =
        state.aiPlayers.has(g.current) || g.players[g.current].isAutoma
      if (!isAI) return

      const roundBefore = g.round
      const draft = clone(g)
      if (!draft.players[draft.current].isAutoma) playAITurn(draft)
      const beat = draft.round !== roundBefore || draft.phase === 'gameOver'

      set({
        game: draft,
        beatingCells: beat ? pulseCells(draft) : [],
        heartbeatRound: beat ? roundBefore : null,
      })
      if (beat) {
        setTimeout(() => set({ beatingCells: [], heartbeatRound: null }), 900)
      }
      setTimeout(step, beat ? 1000 : 520)
    }
    step()
  },
}))
