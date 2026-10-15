import type { CardDef } from '../engine/types'
import { ShieldPip } from './ShieldPip'

interface Props {
  card: CardDef
  faceDown?: boolean
  compact?: boolean
  disabled?: boolean
  affordable?: boolean
  cost?: number // effective cost (after discount) if different
  onClick?: () => void
  selected?: boolean
  cofferCoins?: number
  testid?: string
}

export function CardView({
  card,
  faceDown,
  compact,
  disabled,
  affordable = true,
  cost,
  onClick,
  selected,
  cofferCoins,
  testid,
}: Props) {
  const isKeep = card.deck === 'Keep'
  const edge = isKeep ? 'var(--color-keep)' : 'var(--color-court)'

  if (faceDown) {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`relative rounded-lg card-shadow select-none ${
          compact ? 'w-full h-full' : 'w-32 h-44'
        }`}
        style={{
          background:
            'repeating-linear-gradient(45deg, #3a3326, #3a3326 8px, #332d22 8px, #332d22 16px)',
          border: '2px solid #4a4132',
        }}
      >
        <span className="absolute inset-0 flex items-center justify-center text-3xl opacity-40">
          🛡️
        </span>
        <span className="absolute bottom-1 inset-x-0 text-[10px] text-amber-200/50 uppercase tracking-wider">
          Vagabond
        </span>
      </button>
    )
  }

  return (
    <button
      data-testid={testid}
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-lg card-shadow text-left select-none transition
        ${compact ? 'w-full h-full p-1.5' : 'w-32 h-44 p-2'}
        ${selected ? 'ring-4 ring-amber-300' : ''}
        ${!affordable ? 'opacity-45 grayscale' : 'hover:-translate-y-1'}
        ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
      style={{
        background: 'linear-gradient(170deg, #f7f0dd 0%, #ece0c4 100%)',
        border: `2px solid ${edge}`,
        color: '#2b2419',
      }}
    >
      {/* Cost badge */}
      <span
        className="absolute -top-2 -left-2 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white card-shadow"
        style={{ background: edge }}
      >
        {cost ?? card.cost}
      </span>

      {/* Shields */}
      <div className="absolute top-1 right-1 flex gap-0.5">
        {card.shields.map((s, i) => (
          <ShieldPip key={i} color={s} size={compact ? 12 : 15} />
        ))}
      </div>

      {/* Name */}
      <div
        className={`mt-4 font-semibold leading-tight ${
          compact ? 'text-[10px]' : 'text-xs'
        }`}
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {card.name}
      </div>

      {/* Effects */}
      {!compact && (
        <div className="mt-1 space-y-0.5 text-[9px] leading-snug text-ink/80">
          {card.text.onHire && <div>⚡ {card.text.onHire}</div>}
          {card.text.pulse && <div className="text-rose-700">💓 {card.text.pulse}</div>}
          {card.text.endgame && <div className="text-indigo-800">⭐ {card.text.endgame}</div>}
        </div>
      )}

      {/* Coffer badge */}
      {card.cofferCapacity && (
        <span className="absolute bottom-1 right-1 text-[9px] bg-yellow-700/20 px-1 rounded">
          👛{cofferCoins != null ? `${cofferCoins}/` : ''}
          {card.cofferCapacity}
        </span>
      )}
    </button>
  )
}
