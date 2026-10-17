import { useState } from 'react'
import { Sprite } from './Sprite'

const STEPS = [
  {
    title: 'Goal',
    body: 'Fill your 3x3 castle with 9 characters over 9 rounds. Most victory points wins.',
    bullets: [
      ['icon-crown', 'Points come mostly from what each card scores at the end.'],
      ['icon-shield', 'Cards care about their neighbours, so placement matters.'],
    ],
  },
  {
    title: 'Your turn',
    body: 'Two simple actions, every round.',
    bullets: [
      ['icon-herald', "1. Buy one card from the Herald's row (the glowing one)."],
      ['icon-coin', '2. Place it in your castle, next to a card already there.'],
    ],
  },
  {
    title: 'The three powers',
    body: 'Every card shows which powers it has.',
    bullets: [
      ['icon-onhire', 'ON HIRE — happens once, the moment you place it.'],
      ['icon-pulse', 'PULSE — happens again at the end of every round.'],
      ['icon-crown', 'CROWN — scores points once, at the end of the game.'],
    ],
  },
  {
    title: 'Gold & keys',
    body: 'Two resources, two very different uses.',
    bullets: [
      ['icon-coin', 'Gold buys cards. Left-over gold is worth nothing unless stored in a coffer.'],
      ['icon-key', "Keys move the Herald or refresh a row. Each unused key is 1 point."],
      ['icon-coffer', 'Coffers store gold at the end — each stored coin is 1 point.'],
    ],
  },
  {
    title: 'The Influence race',
    body: 'Every shield you place pushes you up a shared track.',
    bullets: [
      ['icon-shield', 'Leading a track scores points at the end of rounds 3, 6 and 9.'],
      ['icon-crown', 'Later rounds are worth more, so it is never too late.'],
    ],
  },
]

export function HowToPlay({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0)
  const step = STEPS[i]
  const last = i === STEPS.length - 1

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(20,12,6,0.72)' }}
      onClick={onClose}
    >
      <div
        className="panel w-full max-w-md p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-baseline justify-between mb-3">
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 16 }}>
            {step.title}
          </h2>
          <span
            className="opacity-60"
            style={{ fontFamily: 'var(--font-pixel)', fontSize: 10 }}
          >
            {i + 1}/{STEPS.length}
          </span>
        </div>

        <p className="mb-3" style={{ fontSize: 13 }}>
          {step.body}
        </p>

        <ul className="space-y-2 mb-5">
          {step.bullets.map(([icon, text]) => (
            <li
              key={text}
              className="flex items-start gap-2 px-2 py-1.5"
              style={{ background: 'rgba(0,0,0,0.06)', border: '2px solid rgba(43,29,19,0.2)' }}
            >
              <Sprite name={icon} size={16} className="mt-px" />
              <span style={{ fontSize: 12 }}>{text}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2">
          {i > 0 && (
            <button
              className="btn px-3 py-2"
              style={{ fontSize: 11 }}
              onClick={() => setI(i - 1)}
            >
              Back
            </button>
          )}
          <button
            className="btn btn-primary flex-1 px-3 py-2"
            style={{ fontSize: 12 }}
            onClick={() => (last ? onClose() : setI(i + 1))}
          >
            {last ? "Let's play" : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
