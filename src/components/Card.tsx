import type { CardDef } from '../engine/types'
import { RichText } from './RichText'
import { EmblemSprite, ShieldSprite, Sprite } from './Sprite'

export type CardSize = 'market' | 'grid' | 'mini'

interface Props {
  card: CardDef
  size?: CardSize
  faceDown?: boolean
  /** Effective cost after discounts. */
  cost?: number
  /** Player cannot afford it — shows a padlock and desaturates. */
  locked?: boolean
  /** Dim because it isn't the active row. */
  inactive?: boolean
  onClick?: () => void
  disabled?: boolean
  className?: string
  /** Coins stored at scoring time. */
  cofferCoins?: number
  /** VP earned, shown on the score screen. */
  vp?: number
  testid?: string
  /** Plays the heartbeat animation this tick. */
  beating?: boolean
}

// Market cards have a fixed width but grow to fit their text; the flex row
// stretches them all to a common height, so there is no dead space.
const SIZES = {
  market: { w: 130, name: 10.5, body: 9.5, emblem: 26, shield: 14 },
  grid: { w: 0, name: 9.5, body: 8.5, emblem: 20, shield: 12 },
  mini: { w: 0, name: 0, body: 0, emblem: 16, shield: 9 },
} as const

export function Card({
  card,
  size = 'market',
  faceDown,
  cost,
  locked,
  inactive,
  onClick,
  disabled,
  className = '',
  cofferCoins,
  vp,
  testid,
  beating,
}: Props) {
  const s = SIZES[size]
  const isKeep = card.deck === 'Keep'
  const edge = isKeep ? 'var(--color-keep)' : 'var(--color-court)'
  const fixed = size === 'market'

  const base = `relative text-left select-none ${
    fixed ? '' : 'w-full h-full'
  } ${beating ? 'anim-beat' : ''} ${className}`

  // ---- Face-down (Vagabond) ------------------------------------------
  if (faceDown) {
    return (
      <div
        className={base}
        style={fixed ? { width: s.w, minHeight: 150 } : undefined}
      >
        <div
          className="w-full h-full flex flex-col items-center justify-center gap-1"
          style={{
            backgroundColor: '#6b4324',
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(0,0,0,0.18) 0 5px, transparent 5px 10px)',
            border: '3px solid var(--color-ink)',
            boxShadow: '0 3px 0 0 var(--color-ink)',
          }}
        >
          <Sprite name="icon-shield" size={size === 'mini' ? 14 : 22} />
          {size !== 'mini' && (
            <span
              className="text-[8px] uppercase tracking-wider text-parch/70"
              style={{ fontFamily: 'var(--font-pixel)' }}
            >
              Vagabond
            </span>
          )}
        </div>
      </div>
    )
  }

  // ---- Mini (opponent boards): emblem + shields only ------------------
  if (size === 'mini') {
    return (
      <div
        className={`${base} flex items-center justify-center`}
        title={card.name}
        style={{
          background: 'var(--color-parch)',
          border: `2px solid ${edge}`,
        }}
      >
        <EmblemSprite color={card.shields[0]} size={s.emblem} />
      </div>
    )
  }

  // ---- Market / Grid ---------------------------------------------------
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      data-testid={testid}
      onClick={onClick}
      disabled={onClick ? disabled : undefined}
      className={`${base} group flex flex-col overflow-hidden ${
        onClick && !disabled
          ? 'cursor-pointer hover:-translate-y-1 transition-transform'
          : ''
      } ${locked ? 'grayscale-[0.75] opacity-70' : ''} ${
        inactive ? 'opacity-55' : ''
      }`}
      style={{
        ...(fixed ? { width: s.w } : {}),
        background: 'linear-gradient(180deg, #fbf5e4 0%, #efe3c6 100%)',
        border: `3px solid ${edge}`,
        boxShadow: '0 3px 0 0 var(--color-ink)',
      }}
    >
      {/* header: cost + shields */}
      <div
        className="flex items-center justify-between px-1 py-0.5 shrink-0"
        style={{ background: edge }}
      >
        <span
          className="flex items-center gap-0.5 text-parch"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: 11 }}
        >
          <Sprite name="icon-coin" size={12} />
          {cost ?? card.cost}
        </span>
        <span className="flex gap-0.5">
          {card.shields.map((sh, i) => (
            <ShieldSprite key={i} color={sh} size={s.shield} />
          ))}
        </span>
      </div>

      {/* art + name */}
      <div className="flex items-center gap-1.5 px-1.5 pt-1 shrink-0">
        <EmblemSprite color={card.shields[0]} size={s.emblem} />
        <span
          className="leading-tight text-ink min-w-0 break-words"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: s.name }}
        >
          {card.name}
        </span>
      </div>

      {/* powers — always shown, each with its dedicated icon */}
      <div className="flex-1 min-h-0 px-1 pt-1 pb-2.5 space-y-[3px] overflow-hidden">
        {card.text.onHire && (
          <PowerRow
            icon="icon-onhire"
            tint="#f6e3b0"
            text={card.text.onHire}
            size={s.body}
          />
        )}
        {card.text.pulse && (
          <PowerRow
            icon="icon-pulse"
            tint="#f7cdc6"
            text={card.text.pulse}
            size={s.body}
          />
        )}
        {card.text.endgame && (
          <PowerRow
            icon="icon-crown"
            tint="#cfdcf5"
            text={card.text.endgame}
            size={s.body}
          />
        )}
      </div>

      {/* coffer / vp corner badges */}
      {card.cofferCapacity != null && (
        <span
          className="absolute bottom-0.5 right-0.5 flex items-center gap-0.5 px-1 bg-gold/85 border border-ink"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: 8 }}
        >
          <Sprite name="icon-coffer" size={9} />
          {cofferCoins != null ? `${cofferCoins}/` : ''}
          {card.cofferCapacity}
        </span>
      )}
      {vp != null && (
        <span
          className="absolute -top-2 -right-2 flex items-center gap-0.5 px-1 py-0.5 bg-keep text-parch border-2 border-ink anim-pop"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: 9 }}
        >
          {vp}
          <Sprite name="icon-crown" size={10} />
        </span>
      )}
      {locked && (
        <span className="absolute inset-0 flex items-center justify-center bg-ink/25">
          <Sprite name="icon-lock" size={26} />
        </span>
      )}
    </Tag>
  )
}

function PowerRow({
  icon,
  tint,
  text,
  size,
}: {
  icon: string
  tint: string
  text: string
  size: number
}) {
  return (
    <div
      className="flex items-start gap-1 px-1 py-[2px] border border-ink/25"
      style={{ background: tint }}
    >
      <Sprite name={icon} size={11} className="mt-[1px]" />
      <span
        className="leading-[1.15] text-ink-soft"
        style={{ fontFamily: 'var(--font-body)', fontSize: size }}
      >
        <RichText text={text} size={size + 1} />
      </span>
    </div>
  )
}
