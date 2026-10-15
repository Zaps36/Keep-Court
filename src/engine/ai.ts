// ============================================================================
// Simple heuristic AI that actually drafts & places cards (for bot opponents,
// distinct from the influence-only solo Automa). Deterministic given state.
// Not a deep search — a greedy evaluator that keeps games moving and provides
// a credible opponent. Tunable via WEIGHTS.
// ============================================================================

import {
  affordableIndices,
  buyCard,
  cur,
  effectiveCost,
  legalCells,
  mustGoVagabond,
  placeCard,
  takeVagabond,
} from './engine'
import { countColor, neighbors, shieldsOf } from './grid'
import type { CardDef, CellIndex, GameState, PlayerState } from './types'

const WEIGHTS = {
  shield: 1.2,
  coffer: 0.6,
  cheapEngine: 1.0,
  neighborSynergy: 1.5,
  centerBonus: 0.5,
}

/** Play one full AI turn (optional market action skipped for simplicity). */
export function playAITurn(g: GameState): void {
  if (g.phase === 'awaitingBuy') {
    const herald = g.herald
    const idxs = affordableIndices(g)
    if (idxs.length === 0 || mustGoVagabond(g)) {
      // Must take a vagabond — pick the cheapest-value market card anywhere.
      const pick = pickVagabond(g)
      takeVagabond(g, pick.deck, pick.index)
    } else {
      const p = cur(g)
      // Evaluate each affordable card; buy the best.
      let bestIdx = idxs[0]
      let bestScore = -Infinity
      for (const i of idxs) {
        const card = g.market[herald][i]!
        const s = evalCard(p, card) - effectiveCost(p, card) * 0.25
        if (s > bestScore) {
          bestScore = s
          bestIdx = i
        }
      }
      buyCard(g, herald, bestIdx)
    }
  }

  if (g.phase === 'awaitingPlacement') {
    const cells = legalCells(g)
    const p = cur(g)
    const card = g.pendingPlacement!.def
    let bestCell: CellIndex = cells[0]
    let bestScore = -Infinity
    for (const c of cells) {
      const s = evalPlacement(p, card, c)
      if (s > bestScore) {
        bestScore = s
        bestCell = c
      }
    }
    placeCard(g, bestCell, {
      moveHerald: false, // AI keeps it simple
    })
  }
}

function evalCard(p: PlayerState, card: CardDef): number {
  let s = card.shields.length * WEIGHTS.shield
  if (card.cofferCapacity) s += card.cofferCapacity * WEIGHTS.coffer * 0.1
  if (card.cost <= 2 && (card.pulse || card.onHire)) s += WEIGHTS.cheapEngine
  if (card.pulse) s += 0.8
  // Synergy: reward colors the player already collects.
  for (const color of card.shields) s += countColor(p.grid, color) * 0.3
  return s
}

function evalPlacement(p: PlayerState, card: CardDef, cell: CellIndex): number {
  let s = 0
  if (cell === 4) s += WEIGHTS.centerBonus
  const neigh = neighbors(p.grid, cell)
  for (const nb of neigh) {
    const shared = shieldsOf(nb).some((x) => card.shields.includes(x))
    if (shared) s += WEIGHTS.neighborSynergy
  }
  return s
}

function pickVagabond(g: GameState): { deck: 'Keep' | 'Court'; index: number } {
  for (const deck of ['Keep', 'Court'] as const) {
    const idx = g.market[deck].findIndex((c) => c !== null)
    if (idx >= 0) return { deck, index: idx }
  }
  return { deck: 'Keep', index: 0 }
}
