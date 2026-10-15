// Dev self-check: simulate full AI-vs-AI games and assert invariants.
// Run with: npx tsx src/engine/selfcheck.ts
import { playAITurn } from './ai'
import { COURT_CARDS, EDICTS, KEEP_CARDS } from './cards'
import { createGame } from './engine'
import type { GameState } from './types'

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error('ASSERT FAILED: ' + msg)
}

// Roster integrity
assert(KEEP_CARDS.length === 45, `Keep deck is ${KEEP_CARDS.length}, expected 45`)
assert(COURT_CARDS.length === 45, `Court deck is ${COURT_CARDS.length}, expected 45`)
assert(EDICTS.length === 18, `Edicts ${EDICTS.length}, expected 18`)
const ids = new Set([...KEEP_CARDS, ...COURT_CARDS].map((c) => c.id))
assert(ids.size === 90, `Duplicate card IDs! unique=${ids.size}`)

function runOne(seed: number, players: number): GameState {
  const names = Array.from({ length: players }, (_, i) => `AI ${i + 1}`)
  const g = createGame({
    playerNames: names,
    automa: false,
    automaDifficulty: 'normal',
    seed,
  })
  let guard = 0
  while (g.phase !== 'gameOver') {
    playAITurn(g)
    if (++guard > 5000) throw new Error('Game did not terminate')
  }
  // Invariants
  for (const p of g.players) {
    const placed = p.grid.filter(Boolean).length
    assert(placed === 9, `${p.name} has ${placed} cards, expected 9`)
    assert(p.score !== undefined, `${p.name} has no score`)
    assert(p.coins >= 0, `${p.name} has negative coins`)
    assert(p.keys >= 0, `${p.name} has negative keys`)
  }
  return g
}

let min = Infinity
let max = -Infinity
let sum = 0
let n = 0
const trials = 200
for (let s = 1; s <= trials; s++) {
  const players = (s % 3) + 2 // 2,3,4
  const g = runOne(s, players)
  for (const p of g.players) {
    const t = p.score!.total
    min = Math.min(min, t)
    max = Math.max(max, t)
    sum += t
    n++
  }
}
console.log(`Ran ${trials} games across 2-4 players. ${n} player-scores.`)
console.log(`Score range: min=${min}, max=${max}, avg=${(sum / n).toFixed(1)}`)
console.log('All invariants held. ✅')
