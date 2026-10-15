import { SHIELD_META, type ShieldColor } from '../engine/types'

export function ShieldPip({ color, size = 16 }: { color: ShieldColor; size?: number }) {
  const meta = SHIELD_META[color]
  return (
    <span
      title={`${meta.name} — ${meta.theme}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '3px 3px 6px 6px / 3px 3px 10px 10px',
        background: `linear-gradient(160deg, ${meta.hex}, ${shade(meta.hex, -30)})`,
        border: '1px solid rgba(0,0,0,0.3)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
      }}
    />
  )
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt))
  const b = Math.max(0, Math.min(255, (n & 255) + amt))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
