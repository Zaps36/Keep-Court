// ============================================================================
// Zustand store wrapping the pure engine. We deep-clone before each mutation
// so React sees new references (engine functions mutate in place by design).
// ============================================================================

import { create } from 'zustand'
import {
  buyCard as engineBuy,
  createGame,
  moveHeraldAction,
  placeCard as enginePlace,
  refreshRowAction,
  takeVagabond as engineVagabond,
} from '../engine/engine'
import { playAITurn } from '../engine/ai'
import type { EffectChoices } from '../engine/effects'
import type { CellIndex, DeckId, GameConfig, GameState } from '../engine/types'

interface Store {
  game: GameState | null
  /** Set of player ids controlled by AI (for hotseat vs bots). */
  aiPlayers: Set<number>
  /** UI selection: pending choices before placing (herald move toggle, etc.). */
  pendingChoices: EffectChoices
  newGame: (config: GameConfig, aiPlayers?: number[]) => void
  moveHerald: () => void
  refreshRow: () => void
  buy: (deck: DeckId, index: number) => void
  vagabond: (deck: DeckId, index: number) => void
  place: (cell: CellIndex) => void
  setChoices: (c: EffectChoices) => void
  runAITurnsIfNeeded: () => void
}

function clone(g: GameState): GameState {
  return structuredClone(g)
}

export const useGame = create<Store>((set, get) => ({
  game: null,
  aiPlayers: new Set(),
  pendingChoices: {},

  newGame: (config, aiPlayers = []) => {
    const g = createGame(config)
    set({ game: g, aiPlayers: new Set(aiPlayers), pendingChoices: {} })
    // If the first player is an Automa or AI, advance.
    setTimeout(() => get().runAITurnsIfNeeded(), 50)
  },

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
    const g = clone(get().game!)
    enginePlace(g, cell, get().pendingChoices)
    set({ game: g, pendingChoices: {} })
    setTimeout(() => get().runAITurnsIfNeeded(), 350)
  },

  setChoices: (c) => set({ pendingChoices: { ...get().pendingChoices, ...c } }),

  runAITurnsIfNeeded: () => {
    const state = get()
    let g = state.game
    if (!g || g.phase === 'gameOver') return
    const aiSet = state.aiPlayers
    // Step through AI turns one at a time with a visible delay.
    const step = () => {
      const cur = get().game
      if (!cur || cur.phase === 'gameOver') return
      const isAI = aiSet.has(cur.current) || cur.players[cur.current].isAutoma
      if (!isAI) return
      const draft = clone(cur)
      // Automa turns resolve inside engine automatically; for AI players, drive one action.
      if (!draft.players[draft.current].isAutoma) {
        playAITurn(draft)
      }
      set({ game: draft })
      setTimeout(step, 450)
    }
    step()
  },
}))
