// ============================================================================
// Edict (shared objective) scoring. Each returns VP for a given player.
// ============================================================================

import { isLeader } from './effects'
import {
  cellsInCol,
  cellsInRow,
  countColor,
  distinctColors,
  neighborCells,
  shieldsOf,
} from './grid'
import type { EdictDef, GameState, PlacedCard, PlayerState, ShieldColor } from './types'
import { CORNERS, EDGES } from './grid'
import { SHIELD_COLORS } from './types'

export function scoreEdict(
  g: GameState,
  player: PlayerState,
  edict: EdictDef,
): number {
  const [name, ...a] = edict.score.split(':')
  const grid = player.grid
  const n = (s: string) => Number(s) || 0

  switch (name) {
    case 'everyColumnColor': {
      const c1 = a[0] as ShieldColor
      const c2 = a[1] as ShieldColor
      const everyCol = (color: ShieldColor) =>
        [0, 1, 2].every(
          (c) => countColor(cellsInCol(c).map((i) => grid[i]), color) > 0,
        )
      return everyCol(c1) || everyCol(c2) ? n(a[2]) : 0
    }
    case 'noFaceDown':
      return grid.every((c) => c && !c.faceDown) ? n(a[0]) : 0
    case 'perColorInGrid':
      return distinctColors(grid).size * n(a[0])
    case 'cornerTwoShield': {
      let cnt = 0
      for (const corner of CORNERS) {
        const p = grid[corner]
        if (p && !p.faceDown && p.def.shields.length === 2) cnt++
      }
      return cnt * n(a[0])
    }
    case 'centerSharesAll': {
      const center = grid[4]
      if (!center || center.faceDown) return 0
      const cColors = new Set(shieldsOf(center))
      const neigh = neighborCells(4)
        .map((i) => grid[i])
        .filter((p): p is PlacedCard => !!p)
      if (neigh.length < 4) return 0
      const all = neigh.every((p) => shieldsOf(p).some((s) => cColors.has(s)))
      return all ? n(a[0]) : 0
    }
    case 'perKey':
      return Math.min(player.keys * n(a[0]), n(a[1]))
    case 'perCofferPair': {
      const stored = grid.reduce((acc, c) => acc + (c?.cofferCoins ?? 0), 0)
      return Math.min(Math.floor(stored / 2) * n(a[0]), n(a[1]))
    }
    case 'monochromeRow': {
      for (let r = 0; r < 3; r++) {
        const cards = cellsInRow(r).map((i) => grid[i])
        if (cards.some((c) => !c || c.faceDown)) continue
        // Row is monochrome if some single color appears in all three cards.
        const ok = SHIELD_COLORS.some((color) =>
          cards.every((c) => shieldsOf(c).includes(color)),
        )
        if (ok) return n(a[0])
      }
      return 0
    }
    case 'rainbowColumn': {
      for (let c = 0; c < 3; c++) {
        const cards = cellsInCol(c).map((i) => grid[i])
        if (cards.some((x) => !x || x.faceDown)) continue
        const colors = new Set<ShieldColor>()
        cards.forEach((x) => shieldsOf(x).forEach((s) => colors.add(s)))
        if (colors.size >= 3) return n(a[0])
      }
      return 0
    }
    case 'perLeaderTrack': {
      let cnt = 0
      for (const color of SHIELD_COLORS) if (isLeader(g, player.id, color)) cnt++
      return cnt * n(a[0])
    }
    case 'balancedRealm': {
      const colors = distinctColors(grid)
      if (colors.size < 4) return 0
      const over = SHIELD_COLORS.some((c) => countColor(grid, c) > 3)
      return over ? 0 : n(a[0])
    }
    case 'edgeColor': {
      const color = a[0] as ShieldColor
      let cnt = 0
      for (const e of EDGES)
        if (shieldsOf(grid[e]).includes(color)) cnt++
      return cnt * n(a[1])
    }
    case 'colorMinusColor': {
      const plus = a[0] as ShieldColor
      const minus = a[2] as ShieldColor
      return countColor(grid, plus) * n(a[1]) - countColor(grid, minus) * n(a[3])
    }
    case 'sameColorPairs': {
      // Count orthogonal adjacent edges where the two cards share any color.
      let pairs = 0
      for (let i = 0; i < 9; i++) {
        for (const j of neighborCells(i)) {
          if (j <= i) continue // count each edge once
          const si = new Set(shieldsOf(grid[i]))
          if (shieldsOf(grid[j]).some((s) => si.has(s))) pairs++
        }
      }
      return pairs * n(a[0])
    }
    case 'merchantPrince': {
      const hasCoffer = grid.some((c) => c && !c.faceDown && c.def.cofferCapacity)
      // "0 loose coins" is evaluated after coffers are filled at scoring time.
      return player.coins === 0 && hasCoffer ? n(a[0]) : 0
    }
    case 'spire': {
      const sumShields = (cells: number[]) =>
        cells.reduce((acc, i) => acc + shieldsOf(grid[i]).length, 0)
      const top = sumShields(cellsInRow(0))
      const bottom = sumShields(cellsInRow(2))
      return top > bottom ? n(a[0]) : 0
    }
    case 'adjacentColorPair': {
      const first = a[0] as ShieldColor
      const second = a[1] as ShieldColor
      let cnt = 0
      for (let i = 0; i < 9; i++) {
        if (!shieldsOf(grid[i]).includes(first)) continue
        if (neighborCells(i).some((j) => shieldsOf(grid[j]).includes(second)))
          cnt++
      }
      return cnt * n(a[2])
    }
    default:
      return 0
  }
}
