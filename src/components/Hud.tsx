import { useEffect, useRef, useState } from 'react'
import { leadersOf } from '../engine/effects'
import type { GameState, PlayerState } from '../engine/types'
import { INFLUENCE_MAX, SHIELD_COLORS, SHIELD_META } from '../engine/types'
import { MiniGrid } from './CastleGrid'
import { AvatarSprite, ShieldSprite, Sprite } from './Sprite'

export const SEAT_COLORS = ['#f4ecd8', '#e8705a', '#5fc0b0', '#f0c850']

/** Big, unmissable "what do I do right now" banner. */
export function InstructionBar({
  game,
  isAI,
}: {
  game: GameState
  isAI: boolean
}) {
  const player = game.players[game.current]
  const placing = game.phase === 'awaitingPlacement'

  let text: string
  let detail: string
  if (isAI) {
    text = `${player.name} is taking their turn`
    detail = 'Watch the market — they may take the card you want.'
  } else if (placing) {
    text = 'Place your card'
    detail = 'Tap any blinking slot in your castle.'
  } else {
    text = `Buy a card from ${game.herald === 'Keep' ? 'THE KEEP' : 'THE COURT'}`
    detail = "Only the Herald's row is available. Spend a key to switch rows."
  }

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 anim-banner"
      style={{
        background: isAI ? '#4a4034' : 'var(--color-gold)',
        border: '3px solid var(--color-ink)',
        boxShadow: '0 4px 0 0 var(--color-ink)',
      }}
    >
      <span
        className="shrink-0 px-1.5 py-0.5"
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: 10,
          background: 'var(--color-ink)',
          color: 'var(--color-gold-light)',
        }}
      >
        {isAI ? 'WAIT' : 'YOUR TURN'}
      </span>
      <div className="min-w-0">
        <div
          className="leading-tight"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: 13,
            color: isAI ? 'var(--color-parch)' : 'var(--color-ink)',
          }}
        >
          {text}
        </div>
        <div
          className="leading-tight opacity-80"
          style={{
            fontSize: 11,
            color: isAI ? 'var(--color-parch)' : 'var(--color-ink)',
          }}
        >
          {detail}
        </div>
      </div>
    </div>
  )
}

/** Coins/keys with a floating +N animation when they change. */
export function Resources({
  coins,
  keys,
  big,
}: {
  coins: number
  keys: number
  big?: boolean
}) {
  const coinDelta = useDelta(coins)
  const keyDelta = useDelta(keys)
  const fs = big ? 16 : 12
  const icon = big ? 20 : 15

  return (
    <div className="flex items-center gap-3">
      <Stat
        icon="icon-coin"
        value={coins}
        delta={coinDelta}
        fontSize={fs}
        iconSize={icon}
        label="gold"
      />
      <Stat
        icon="icon-key"
        value={keys}
        delta={keyDelta}
        fontSize={fs}
        iconSize={icon}
        label="keys"
      />
    </div>
  )
}

function Stat({
  icon,
  value,
  delta,
  fontSize,
  iconSize,
  label,
}: {
  icon: string
  value: number
  delta: number | null
  fontSize: number
  iconSize: number
  label: string
}) {
  return (
    <span className="relative flex items-center gap-1" title={label}>
      <Sprite name={icon} size={iconSize} />
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize }}>{value}</span>
      {delta != null && delta !== 0 && (
        <span
          key={`${value}-${delta}`}
          className="absolute -top-1 left-4 anim-float pointer-events-none"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: fontSize - 1,
            color: delta > 0 ? '#2f9d52' : '#d2432f',
            textShadow: '1px 1px 0 #fff',
          }}
        >
          {delta > 0 ? `+${delta}` : delta}
        </span>
      )}
    </span>
  )
}

/** Returns the most recent change to a number (for +N popups). */
function useDelta(value: number) {
  const prev = useRef(value)
  const [delta, setDelta] = useState<number | null>(null)
  useEffect(() => {
    if (prev.current !== value) {
      setDelta(value - prev.current)
      prev.current = value
      const t = setTimeout(() => setDelta(null), 1100)
      return () => clearTimeout(t)
    }
  }, [value])
  return delta
}

/** Compact influence tracks. */
export function InfluenceTracks({ game }: { game: GameState }) {
  return (
    <div className="space-y-1">
      {SHIELD_COLORS.map((color) => {
        const vals = game.influence[color]
        const leaders = leadersOf(game, color)
        return (
          <div key={color} className="flex items-center gap-1.5">
            <ShieldSprite
              color={color}
              size={14}
              title={`${SHIELD_META[color].name} — ${SHIELD_META[color].theme}`}
            />
            <div
              className="relative flex-1 h-3"
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {vals.map((v, pid) => (
                <span
                  key={pid}
                  className="absolute top-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{
                    left: `calc(${(v / INFLUENCE_MAX) * 100}% - 4px)`,
                    width: 8,
                    height: 8,
                    background: SEAT_COLORS[pid % 4],
                    border: '1px solid var(--color-ink)',
                    outline: leaders.includes(pid)
                      ? '2px solid var(--color-gold-light)'
                      : 'none',
                    zIndex: 10 - pid,
                  }}
                  title={`${game.players[pid].name}: ${v}`}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/** Player strip: avatar, name, resources, mini grid. */
export function PlayerCard({
  player,
  avatar,
  active,
  showGrid,
}: {
  player: PlayerState
  avatar: string
  active: boolean
  showGrid?: boolean
}) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5"
      style={{
        background: active ? 'rgba(255,217,107,0.2)' : 'rgba(0,0,0,0.2)',
        border: `3px solid ${active ? 'var(--color-gold-light)' : 'rgba(0,0,0,0.35)'}`,
      }}
    >
      <span
        style={{
          border: '2px solid var(--color-ink)',
          background: SEAT_COLORS[player.id % 4],
          lineHeight: 0,
        }}
      >
        <AvatarSprite id={avatar} size={34} />
      </span>
      <div className="min-w-0 flex-1">
        <div
          className="truncate text-parch"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: 10 }}
        >
          {player.name}
        </div>
        <div className="text-parch">
          <Resources coins={player.coins} keys={player.keys} />
        </div>
      </div>
      {showGrid && <MiniGrid player={player} />}
    </div>
  )
}
