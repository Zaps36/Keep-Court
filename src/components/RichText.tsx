// Replaces the icon characters used in card/edict text with our pixel sprites,
// so the card data stays plain strings but the UI shows real art (no emoji).

import { Fragment, type ReactNode } from 'react'
import { Sprite } from './Sprite'

const MAP: Record<string, string> = {
  '\u{1FA99}': 'icon-coin', // coin
  '\u{1F5DD}': 'icon-key', // key
  '\u{1F45B}': 'icon-coffer', // purse/coffer
  '\u2B50': 'icon-crown', // victory points
  '\u26A1': 'icon-onhire', // instant
  '\u{1F493}': 'icon-pulse', // pulse
}

const VS16 = '\uFE0F'

export function RichText({
  text,
  size = 12,
  className = '',
}: {
  text: string
  size?: number
  className?: string
}) {
  // Strip variation selectors so "key + VS16" matches the base char.
  const clean = text.replaceAll(VS16, '').replaceAll('\u27A1', '->')

  const out: ReactNode[] = []
  let buffer = ''
  for (const ch of clean) {
    const sprite = MAP[ch]
    if (sprite) {
      if (buffer) {
        out.push(<Fragment key={out.length}>{buffer}</Fragment>)
        buffer = ''
      }
      out.push(
        <Sprite
          key={out.length}
          name={sprite}
          size={size}
          className="-mt-px align-text-bottom"
        />,
      )
    } else {
      buffer += ch
    }
  }
  if (buffer) out.push(<Fragment key={out.length}>{buffer}</Fragment>)

  return <span className={className}>{out}</span>
}
