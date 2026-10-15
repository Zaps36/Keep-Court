import { leadersOf } from '../engine/effects'
import type { GameState } from '../engine/types'
import { INFLUENCE_MAX, SHIELD_COLORS, SHIELD_META } from '../engine/types'

const PLAYER_COLORS = ['#f4ecd8', '#ff6b6b', '#4ecdc4', '#ffe66d']

export function InfluenceBoard({ game }: { game: GameState }) {
  return (
    <div className="rounded-xl p-3 bg-black/30 inset-panel">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-amber-100" style={{ fontFamily: 'var(--font-display)' }}>
          Influence
        </h3>
        <span className="text-[10px] text-amber-200/60">
          Era {game.era} · 1st={game.era * 2} 2nd={game.era} VP
        </span>
      </div>
      <div className="space-y-1.5">
        {SHIELD_COLORS.map((color) => {
          const meta = SHIELD_META[color]
          const vals = game.influence[color]
          const leaders = leadersOf(game, color)
          return (
            <div key={color} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded shrink-0"
                style={{ background: meta.hex, border: '1px solid rgba(0,0,0,0.4)' }}
                title={meta.name}
              />
              <div className="relative flex-1 h-5 rounded bg-black/40 overflow-hidden">
                {/* tick marks */}
                {Array.from({ length: INFLUENCE_MAX }, (_, i) => (
                  <span
                    key={i}
                    className="absolute top-0 bottom-0 w-px bg-white/5"
                    style={{ left: `${((i + 1) / INFLUENCE_MAX) * 100}%` }}
                  />
                ))}
                {vals.map((v, pid) => (
                  <span
                    key={pid}
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-black/50 transition-all"
                    style={{
                      left: `calc(${(v / INFLUENCE_MAX) * 100}% - 6px)`,
                      background: PLAYER_COLORS[pid % 4],
                      zIndex: 10 - pid,
                      boxShadow: leaders.includes(pid)
                        ? '0 0 0 2px rgba(255,215,0,0.8)'
                        : 'none',
                    }}
                    title={`${game.players[pid].name}: ${v}`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { PLAYER_COLORS }
