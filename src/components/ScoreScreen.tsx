import type { GameState } from '../engine/types'
import { PLAYER_COLORS } from './InfluenceBoard'

interface Props {
  game: GameState
  onNewGame: () => void
}

export function ScoreScreen({ game, onNewGame }: Props) {
  const ranked = [...game.players].sort(
    (a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0),
  )
  const winner = ranked[0]

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-2">👑</div>
        <h1 className="text-4xl font-bold text-amber-100" style={{ fontFamily: 'var(--font-display)' }}>
          {winner.name} wins!
        </h1>
        <p className="text-amber-200/70 mt-1">{winner.score?.total} victory points</p>
      </div>

      <div className="space-y-4">
        {ranked.map((p, rank) => {
          const s = p.score!
          return (
            <div key={p.id} className="rounded-xl bg-black/30 p-4 inset-panel">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl font-bold text-amber-200/50 w-6">#{rank + 1}</span>
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ background: PLAYER_COLORS[p.id % 4] }}
                />
                <span className="font-semibold text-amber-100 flex-1">{p.name}</span>
                <span className="text-2xl font-bold text-amber-100">{s.total}</span>
              </div>
              {!p.isAutoma && (
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <Stat label="Cards" value={s.cards} />
                  <Stat label="Coffers" value={s.coffers} />
                  <Stat label="Keys" value={s.keys} />
                  <Stat label="Influence" value={s.banked} />
                  <Stat label="Edicts" value={s.edicts} />
                </div>
              )}
              {p.isAutoma && (
                <div className="text-center text-xs text-amber-200/60">
                  Steward scored {s.banked} from Influence majorities.
                </div>
              )}
              {!p.isAutoma && s.edictDetail.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 justify-center">
                  {s.edictDetail.map((e) => (
                    <span
                      key={e.id}
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        e.vp > 0 ? 'bg-emerald-800/40 text-emerald-200' : 'bg-white/5 text-amber-200/40'
                      }`}
                    >
                      {e.name}: {e.vp > 0 ? '+' : ''}
                      {e.vp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        onClick={onNewGame}
        className="mt-8 w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 text-black font-bold py-3 text-lg hover:brightness-110 transition card-shadow"
      >
        Play Again
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/5 py-2">
      <div className="text-base font-bold text-amber-100">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-amber-200/50">{label}</div>
    </div>
  )
}
