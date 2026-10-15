import { useState } from 'react'
import { dateSeed } from '../engine/rng'
import type { GameConfig } from '../engine/types'

interface Props {
  onStart: (config: GameConfig, aiPlayers: number[]) => void
}

type Mode = 'hotseat' | 'bot' | 'solo' | 'daily'

export function SetupScreen({ onStart }: Props) {
  const [mode, setMode] = useState<Mode>('bot')
  const [humans, setHumans] = useState(1)
  const [bots, setBots] = useState(1)
  const [difficulty, setDifficulty] = useState<'easy' | 'normal' | 'hard'>('normal')

  const start = () => {
    let names: string[] = []
    const aiPlayers: number[] = []
    let automa = false
    let seed = Math.floor(Math.random() * 0xffffffff)

    if (mode === 'hotseat') {
      names = Array.from({ length: humans }, (_, i) => `Player ${i + 1}`)
    } else if (mode === 'bot') {
      names = [
        'You',
        ...Array.from({ length: bots }, (_, i) => `Bot ${i + 1}`),
      ]
      for (let i = 1; i <= bots; i++) aiPlayers.push(i)
    } else if (mode === 'solo') {
      names = ['You', 'Steward']
      automa = true
    } else if (mode === 'daily') {
      names = ['You', 'Steward']
      automa = true
      seed = dateSeed()
    }

    onStart({ playerNames: names, automa, automaDifficulty: difficulty, seed }, aiPlayers)
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10 text-center">
      <h1
        className="text-5xl font-bold text-amber-100 mb-1"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Keep &amp; Court
      </h1>
      <p className="text-amber-200/70 mb-8 italic">
        Shop characters into your 3×3 castle. Your combos beat each round. Race the whole court for Influence.
      </p>

      <div className="rounded-2xl bg-black/30 p-6 space-y-6 inset-panel text-left">
        <div>
          <label className="block text-xs uppercase tracking-wider text-amber-200/60 mb-2">
            Mode
          </label>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['bot', '🤖 vs Bots'],
              ['solo', '🧩 Solo (Steward)'],
              ['hotseat', '👥 Hotseat'],
              ['daily', '📅 Daily Puzzle'],
            ] as [Mode, string][]).map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  mode === m
                    ? 'bg-amber-400 text-black'
                    : 'bg-white/5 text-amber-100 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'hotseat' && (
          <Stepper label="Players" value={humans} setValue={setHumans} min={2} max={4} />
        )}
        {mode === 'bot' && (
          <Stepper label="Bots" value={bots} setValue={setBots} min={1} max={3} />
        )}
        {(mode === 'solo' || mode === 'daily' || mode === 'bot') && (
          <div>
            <label className="block text-xs uppercase tracking-wider text-amber-200/60 mb-2">
              {mode === 'bot' ? 'Bot' : 'Steward'} difficulty
            </label>
            <div className="flex gap-2">
              {(['easy', 'normal', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm capitalize transition ${
                    difficulty === d
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/5 text-amber-100 hover:bg-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'daily' && (
          <p className="text-xs text-amber-200/60">
            Everyone gets the same deck order today. Compare scores!
          </p>
        )}

        <button
          onClick={start}
          className="w-full rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 text-black font-bold py-3 text-lg hover:brightness-110 transition card-shadow"
        >
          Begin the Game
        </button>
      </div>
    </div>
  )
}

function Stepper({
  label,
  value,
  setValue,
  min,
  max,
}: {
  label: string
  value: number
  setValue: (n: number) => void
  min: number
  max: number
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-amber-200/60 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setValue(Math.max(min, value - 1))}
          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-amber-100 text-xl"
        >
          −
        </button>
        <span className="text-2xl font-bold text-amber-100 w-8 text-center">{value}</span>
        <button
          onClick={() => setValue(Math.min(max, value + 1))}
          className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 text-amber-100 text-xl"
        >
          +
        </button>
      </div>
    </div>
  )
}
