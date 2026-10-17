import { useState } from 'react'
import { dateSeed } from '../engine/rng'
import type { GameConfig } from '../engine/types'
import { AVATAR_IDS, AVATAR_LABELS, AvatarSprite, Sprite } from './Sprite'

type Mode = 'bot' | 'solo' | 'hotseat' | 'daily'

const MODES: { id: Mode; label: string; blurb: string }[] = [
  { id: 'bot', label: 'vs Bots', blurb: 'Play against 1-3 computer rivals.' },
  { id: 'solo', label: 'Solo', blurb: 'Race the Steward for influence.' },
  { id: 'hotseat', label: 'Hotseat', blurb: 'Pass one device, 2-4 players.' },
  { id: 'daily', label: 'Daily', blurb: 'Same deck for everyone today.' },
]

interface Props {
  onStart: (config: GameConfig, aiPlayers: number[], avatars: string[]) => void
  onHelp: () => void
}

export function SetupScreen({ onStart, onHelp }: Props) {
  const [mode, setMode] = useState<Mode>('bot')
  const [count, setCount] = useState(1)
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal')
  const [avatar, setAvatar] = useState<string>('knight')

  const start = () => {
    let names: string[] = []
    const ai: number[] = []
    let avatars: string[] = []
    let automa = false
    let seed = Math.floor(Math.random() * 0xffffffff)

    const others = AVATAR_IDS.filter((a) => a !== avatar)

    if (mode === 'hotseat') {
      names = Array.from({ length: count + 1 }, (_, i) =>
        i === 0 ? 'You' : `Player ${i + 1}`,
      )
      avatars = [avatar, ...others.slice(0, count)]
    } else if (mode === 'bot') {
      names = ['You', ...Array.from({ length: count }, (_, i) => `Bot ${i + 1}`)]
      for (let i = 1; i <= count; i++) ai.push(i)
      avatars = [avatar, ...others.slice(0, count)]
    } else {
      names = ['You', 'Steward']
      automa = true
      avatars = [avatar, 'steward']
      if (mode === 'daily') seed = dateSeed()
    }

    onStart(
      { playerNames: names, automa, automaDifficulty: difficulty, seed },
      ai,
      avatars,
    )
  }

  const showCount = mode === 'bot' || mode === 'hotseat'
  const showDiff = mode !== 'hotseat'

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Title plate */}
        <div
          className="text-center mb-4 px-4 py-5"
          style={{
            background: 'var(--color-parch)',
            border: '4px solid var(--color-ink)',
            boxShadow: '0 6px 0 0 var(--color-ink)',
          }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sprite name="icon-crown" size={26} />
            <h1
              className="leading-none"
              style={{ fontFamily: 'var(--font-title)', fontSize: 20 }}
            >
              KEEP
            </h1>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: 14 }}>&amp;</span>
            <h1
              className="leading-none"
              style={{ fontFamily: 'var(--font-title)', fontSize: 20 }}
            >
              COURT
            </h1>
            <Sprite name="icon-crown" size={26} />
          </div>
          <p style={{ fontSize: 12 }} className="text-ink-soft">
            Hire nine souls. Build a 3x3 castle. Your combos beat every round.
          </p>
        </div>

        <div className="panel p-4 space-y-4">
          {/* Avatar picker */}
          <Field label="Your portrait">
            <div className="flex flex-wrap gap-2">
              {AVATAR_IDS.map((id) => (
                <button
                  key={id}
                  onClick={() => setAvatar(id)}
                  title={AVATAR_LABELS[id]}
                  className="p-0.5 transition-transform hover:-translate-y-0.5"
                  style={{
                    border: `3px solid ${
                      avatar === id ? 'var(--color-gold)' : 'rgba(43,29,19,0.3)'
                    }`,
                    background: avatar === id ? 'var(--color-gold-light)' : '#fff',
                    lineHeight: 0,
                  }}
                >
                  <AvatarSprite id={id} size={42} />
                </button>
              ))}
            </div>
            <p className="mt-1 text-ink-soft" style={{ fontSize: 11 }}>
              Playing as <b>{AVATAR_LABELS[avatar]}</b>
            </p>
          </Field>

          {/* Mode */}
          <Field label="Mode">
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="btn px-2 py-2 text-left"
                  style={{
                    background:
                      mode === m.id ? 'var(--color-gold)' : 'var(--color-parch-2)',
                  }}
                >
                  <span style={{ fontSize: 11 }}>{m.label}</span>
                  <span
                    className="block text-ink-soft"
                    style={{ fontFamily: 'var(--font-body)', fontSize: 10 }}
                  >
                    {m.blurb}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          {showCount && (
            <Field label={mode === 'bot' ? 'Number of bots' : 'Other players'}>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className="btn w-11 py-1.5"
                    style={{
                      fontSize: 13,
                      background:
                        count === n ? 'var(--color-gold)' : 'var(--color-parch-2)',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Field>
          )}

          {showDiff && (
            <Field label="Difficulty">
              <div className="flex gap-2">
                {(['easy', 'normal', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className="btn flex-1 py-1.5 capitalize"
                    style={{
                      fontSize: 11,
                      background:
                        difficulty === d
                          ? 'var(--color-gold)'
                          : 'var(--color-parch-2)',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>
          )}

          <div className="flex gap-2 pt-1">
            <button className="btn px-3 py-3" style={{ fontSize: 11 }} onClick={onHelp}>
              How to play
            </button>
            <button
              className="btn btn-primary flex-1 py-3"
              style={{ fontSize: 14 }}
              onClick={start}
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        className="mb-1.5 text-ink-soft uppercase"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: 9, letterSpacing: 1 }}
      >
        {label}
      </div>
      {children}
    </div>
  )
}
