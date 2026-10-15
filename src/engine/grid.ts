// ============================================================================
// Grid geometry helpers for the 3x3 tableau.
// Cells are indexed 0..8:  0 1 2 / 3 4 5 / 6 7 8  (a1 a2 a3 / b1 b2 b3 / c1 c2 c3)
// ============================================================================

import type { CellIndex, PlacedCard, ShieldColor } from './types'

export const CORNERS: CellIndex[] = [0, 2, 6, 8]
export const EDGES: CellIndex[] = [1, 3, 5, 7]
export const CENTER: CellIndex = 4

export const rowOf = (cell: number): number => Math.floor(cell / 3) // 0,1,2 (a,b,c)
export const colOf = (cell: number): number => cell % 3 // 0,1,2 (1,2,3)

/** Orthogonal neighbor cell indices for a given cell. */
export function neighborCells(cell: number): CellIndex[] {
  const r = rowOf(cell)
  const c = colOf(cell)
  const out: CellIndex[] = []
  if (r > 0) out.push((cell - 3) as CellIndex)
  if (r < 2) out.push((cell + 3) as CellIndex)
  if (c > 0) out.push((cell - 1) as CellIndex)
  if (c < 2) out.push((cell + 1) as CellIndex)
  return out
}

export const cellsInRow = (r: number): CellIndex[] =>
  [0, 1, 2].map((c) => (r * 3 + c) as CellIndex)

export const cellsInCol = (c: number): CellIndex[] =>
  [0, 1, 2].map((r) => (r * 3 + c) as CellIndex)

/** Face-up placed cards orthogonally adjacent to a cell. */
export function neighbors(
  grid: (PlacedCard | null)[],
  cell: number,
): PlacedCard[] {
  return neighborCells(cell)
    .map((n) => grid[n])
    .filter((p): p is PlacedCard => !!p)
}

/** Shields of a placed card, or [] if face down. */
export function shieldsOf(p: PlacedCard | null): ShieldColor[] {
  if (!p || p.faceDown) return []
  return p.def.shields
}

/** Count a color's shields among a list of placed cards. */
export function countColor(
  cards: (PlacedCard | null)[],
  color: ShieldColor,
): number {
  let n = 0
  for (const p of cards) for (const s of shieldsOf(p)) if (s === color) n++
  return n
}

/** Distinct colors present among a list of placed cards. */
export function distinctColors(cards: (PlacedCard | null)[]): Set<ShieldColor> {
  const set = new Set<ShieldColor>()
  for (const p of cards) for (const s of shieldsOf(p)) set.add(s)
  return set
}

/**
 * Legal placement cells for the next card given the current grid.
 * Rules: must be empty; if any card exists, must be orthogonally adjacent to a
 * placed card; and the resulting bounding box of all placed cards must fit 3x3
 * (always true within a fixed 3x3, so adjacency + emptiness suffice here —
 * the fixed 9-cell board inherently bounds the footprint).
 */
export function legalPlacements(grid: (PlacedCard | null)[]): CellIndex[] {
  const occupied = grid.some((c) => c !== null)
  if (!occupied) {
    // First card: any cell is legal.
    return [0, 1, 2, 3, 4, 5, 6, 7, 8]
  }
  const out: CellIndex[] = []
  for (let i = 0 as CellIndex; i < 9; i = (i + 1) as CellIndex) {
    if (grid[i]) continue
    if (neighborCells(i).some((n) => grid[n])) out.push(i)
  }
  return out
}
