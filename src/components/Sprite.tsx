// Renders our hand-authored pixel sprites crisply at any size.
// Sprites are imported eagerly so Vite hashes them and base paths work.

import type { ShieldColor } from '../engine/types'

const files = import.meta.glob<string>('../assets/sprites/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
})

/** Map "icon-coin" -> resolved URL. */
const urls: Record<string, string> = {}
for (const [path, url] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace('.png', '')
  urls[name] = url
}

export type SpriteName =
  | 'icon-onhire'
  | 'icon-pulse'
  | 'icon-crown'
  | 'icon-coin'
  | 'icon-key'
  | 'icon-coffer'
  | 'icon-lock'
  | 'icon-herald'
  | 'icon-shield'

export function Sprite({
  name,
  size = 16,
  className = '',
  title,
}: {
  name: string
  size?: number
  className?: string
  title?: string
}) {
  const src = urls[name]
  if (!src) return null
  return (
    <img
      src={src}
      alt=""
      title={title}
      // Small PNGs get inlined as data URLs by the bundler, so expose the
      // logical name for tests and debugging.
      data-sprite={name}
      draggable={false}
      className={`pixel inline-block shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

export const ShieldSprite = ({
  color,
  size = 16,
  title,
}: {
  color: ShieldColor
  size?: number
  title?: string
}) => <Sprite name={`shield-${color.toLowerCase()}`} size={size} title={title} />

export const EmblemSprite = ({
  color,
  size = 16,
}: {
  color: ShieldColor
  size?: number
}) => <Sprite name={`emblem-${color.toLowerCase()}`} size={size} />

export const AvatarSprite = ({
  id,
  size = 32,
  className = '',
}: {
  id: string
  size?: number
  className?: string
}) => <Sprite name={`avatar-${id}`} size={size} className={className} />

export const AVATAR_IDS = [
  'knight',
  'queen',
  'monk',
  'merchant',
  'farmer',
  'jester',
] as const

export const AVATAR_LABELS: Record<string, string> = {
  knight: 'Knight',
  queen: 'Queen',
  monk: 'Monk',
  merchant: 'Merchant',
  farmer: 'Farmer',
  jester: 'Jester',
  steward: 'Steward',
}
