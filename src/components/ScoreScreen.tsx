import { useEffect, useState } from 'react'
import type { GameState } from '../engine/types'
import { CastleGrid } from './CastleGrid'
import { SEAT_COLORS } from './Hud'
import { AvatarSprite, Sprite } from './Sprite'

interface Props {
  game: GameState
  avatars: string[]
  onNewGame: () => void
}

export function ScoreScreen({ game, avatars, onNewGame }: Props) {
  const ranked = [...game.players].sort(
    (a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0),
  )
  const winner = ranked[0]
  const you = game.players[0]
  const total = useCountUp(winner.score?.total ?? 0)

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Winner plate */}
        <div
          className="text-center px-4 py-5 anim-pop"
          style={{
            background: 'var(--color-parch)',
            border: '4px solid var(--color-ink)',
            boxShadow: '0 6px 0 0 var(--color-ink)',
          }}
        >
          <div className="flex justify-center mb-2">
            <Sprite name="icon-crown" size={40} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 18 }}>
            {winner.name} wins
          </h1>
          <div
            className="mt-1 flex items-center justify-center gap-1"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: 22 }}
          >
            {total}
            <Sprite name="icon-crown" size={20} />
          </div>
        </div>

        {/* Standings */}
        <div className="space-y-2">
          {ranked.map((p, rank) => {
            const s = p.score!
            return (
              <div
                key={p.id}
                className="px-3 py-2"
                style={{
                  background: 'var(--color-parch)',
                  border: '3px solid var(--color-ink)',
                  boxShadow: '0 4px 0 0 var(--color-ink)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 13 }}
                    className="w-7 text-ink-soft"
                  >
                    #{rank + 1}
                  </span>
                  <span
                    style={{
                      border: '2px solid var(--color-ink)',
                      background: SEAT_COLORS[p.id % 4],
                      lineHeight: 0,
                    }}
                  >
                    <AvatarSprite id={avatars[p.id] ?? 'knight'} size={30} />
                  </span>
                  <span
                    className="flex-1"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 12 }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{ fontFamily: 'var(--font-pixel)', fontSize: 16 }}
                  >
                    {s.total}
                    <Sprite name="icon-crown" size={15} />
                  </span>
                </div>

                {!p.isAutoma ? (
                  <div className="mt-2 grid grid-cols-5 gap-1.5">
                    <Stat label="Cards" value={s.cards} icon="icon-crown" />
                    <Stat label="Coffers" value={s.coffers} icon="icon-coffer" />
                    <Stat label="Keys" value={s.keys} icon="icon-key" />
                    <Stat label="Influence" value={s.banked} icon="icon-shield" />
                    <Stat label="Edicts" value={s.edicts} icon="icon-crown" />
                  </div>
                ) : (
                  <p className="mt-1 text-ink-soft" style={{ fontSize: 11 }}>
                    The Steward scored {s.banked} from influence majorities.
                  </p>
                )}

                {!p.isAutoma && s.edictDetail.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {s.edictDetail.map((e) => (
                      <span
                        key={e.id}
                        className="px-1.5 py-0.5"
                        style={{
                          fontSize: 10,
                          background: e.vp > 0 ? '#cde8d0' : 'rgba(0,0,0,0.06)',
                          border: '1px solid rgba(43,29,19,0.25)',
                        }}
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

        {/* Your castle, with per-card scores */}
        {you.score && (
          <div
            className="p-3"
            style={{
              background: 'rgba(0,0,0,0.25)',
              border: '3px solid var(--color-ink)',
            }}
          >
            <h3
              className="mb-2 text-parch"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 11 }}
            >
              Your castle — points per card
            </h3>
            <div className="max-w-md mx-auto">
              <CastleGrid player={you} perCard={you.score.perCard} />
            </div>
          </div>
        )}

        <button
          className="btn btn-primary w-full py-3"
          style={{ fontSize: 14 }}
          onClick={onNewGame}
        >
          Play again
        </button>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: string
}) {
  return (
    <div
      className="text-center py-1.5"
      style={{ background: 'rgba(0,0,0,0.06)', border: '2px solid rgba(43,29,19,0.2)' }}
    >
      <div className="flex items-center justify-center gap-1">
        <Sprite name={icon} size={12} />
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 13 }}>{value}</span>
      </div>
      <div
        className="text-ink-soft uppercase"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: 7, letterSpacing: 0.5 }}
      >
        {label}
      </div>
    </div>
  )
}

/** Ticks a number up for a satisfying reveal. */
function useCountUp(target: number, ms = 900) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (target <= 0) {
      setN(0)
      return
    }
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms)
      setN(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return n
}
