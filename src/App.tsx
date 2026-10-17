import { useEffect, useState } from 'react'
import { CastleGrid } from './components/CastleGrid'
import { HowToPlay } from './components/HowToPlay'
import {
  InfluenceTracks,
  InstructionBar,
  PlayerCard,
  Resources,
} from './components/Hud'
import { Market } from './components/Market'
import { RichText } from './components/RichText'
import { ScoreScreen } from './components/ScoreScreen'
import { SetupScreen } from './components/SetupScreen'
import { Sprite } from './components/Sprite'
import { canUseMarketAction, cur } from './engine/engine'
import type { CellIndex } from './engine/types'
import { TOTAL_ROUNDS } from './engine/types'
import { useGame } from './store/gameStore'

const SEEN_HELP = 'kc_seen_help'

/** "You" -> "Your Castle"; anyone else -> "Ada's Castle". */
function castleLabel(name: string): string {
  if (name.toLowerCase() === 'you') return 'Your Castle'
  return `${name}${name.endsWith('s') ? "'" : "'s"} Castle`
}

export default function App() {
  const game = useGame((s) => s.game)
  const aiPlayers = useGame((s) => s.aiPlayers)
  const avatars = useGame((s) => s.avatars)
  const beatingCells = useGame((s) => s.beatingCells)
  const heartbeatRound = useGame((s) => s.heartbeatRound)
  const { newGame, quit, moveHerald, refreshRow, buy, vagabond, place } = useGame()

  const [help, setHelp] = useState(false)
  const [logOpen, setLogOpen] = useState(false)

  // Show the primer automatically the very first time.
  useEffect(() => {
    if (!localStorage.getItem(SEEN_HELP)) {
      setHelp(true)
      localStorage.setItem(SEEN_HELP, '1')
    }
  }, [])

  if (!game) {
    return (
      <>
        <SetupScreen
          onStart={(cfg, ai, avs) => newGame(cfg, ai, avs)}
          onHelp={() => setHelp(true)}
        />
        {help && <HowToPlay onClose={() => setHelp(false)} />}
      </>
    )
  }

  if (game.phase === 'gameOver') {
    return (
      <ScoreScreen game={game} avatars={avatars} onNewGame={quit} />
    )
  }

  const player = cur(game)
  const isAI = aiPlayers.has(game.current) || player.isAutoma
  const isHumanTurn = !isAI
  const placing = game.phase === 'awaitingPlacement'
  const opponents = game.players.filter((p) => p.id !== game.current)

  return (
    <div className="min-h-screen p-3 md:p-4">
      <div className="max-w-[1320px] mx-auto space-y-3">
        {/* ---------- Top bar ---------- */}
        <header
          className="flex items-center gap-3 px-3 py-2"
          style={{
            background: 'var(--color-parch)',
            border: '3px solid var(--color-ink)',
            boxShadow: '0 4px 0 0 var(--color-ink)',
          }}
        >
          <div className="flex items-center gap-1.5">
            <Sprite name="icon-crown" size={18} />
            <span style={{ fontFamily: 'var(--font-title)', fontSize: 11 }}>
              KEEP &amp; COURT
            </span>
          </div>

          {/* round pips */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span
              className="text-ink-soft uppercase"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 9 }}
            >
              Round
            </span>
            <div className="flex gap-[3px]">
              {Array.from({ length: TOTAL_ROUNDS }, (_, i) => (
                <span
                  key={i}
                  title={`Round ${i + 1}`}
                  style={{
                    width: 11,
                    height: 11,
                    border: '2px solid var(--color-ink)',
                    background:
                      i + 1 < game.round
                        ? 'var(--color-ink-soft)'
                        : i + 1 === game.round
                          ? 'var(--color-gold)'
                          : 'transparent',
                  }}
                />
              ))}
            </div>
            <span
              className="ml-1 px-1.5"
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: 9,
                background: 'var(--color-keep)',
                color: 'var(--color-parch)',
                border: '2px solid var(--color-ink)',
              }}
            >
              ERA {game.era}
            </span>
          </div>

          <button
            className="btn px-2 py-1"
            style={{ fontSize: 10 }}
            onClick={() => setHelp(true)}
          >
            ?
          </button>
          <button
            className="btn px-2 py-1"
            style={{ fontSize: 10 }}
            onClick={quit}
          >
            Quit
          </button>
        </header>

        {/* ---------- What to do now + your purse ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
          <InstructionBar game={game} isAI={isAI} />
          <div
            className="flex items-center justify-center gap-4 px-4 py-2"
            style={{
              background: 'var(--color-parch)',
              border: '3px solid var(--color-ink)',
              boxShadow: '0 4px 0 0 var(--color-ink)',
            }}
          >
            <Resources coins={player.coins} keys={player.keys} big />
          </div>
        </div>

        {/* ---------- Main: market | castle | side ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_236px] gap-3 items-start">
          {/* Market column is sized to fit exactly 3 cards + the row label:
              22 (section pad/border) + 22 (row pad/border) + 66 (label)
              + 8 (gap) + 3*130 + 2*8 (card gaps) = 524 */}
          <div className="grid grid-cols-1 xl:grid-cols-[524px_minmax(0,1fr)] gap-3 items-start min-w-0">
            {/* Market */}
            <section
              className="p-2 min-w-0"
              style={{
                background: 'rgba(0,0,0,0.22)',
                border: '3px solid var(--color-ink)',
              }}
            >
              <div className="overflow-x-auto scroll-parch">
                <div className="min-w-[480px]">
                  <Market
                    game={game}
                    interactive={isHumanTurn}
                    onBuy={buy}
                    onVagabond={vagabond}
                  />
                </div>
              </div>

              {isHumanTurn && game.phase === 'awaitingBuy' && (
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <button
                    className="btn px-2.5 py-1.5 flex items-center gap-1.5"
                    style={{ fontSize: 10 }}
                    disabled={!canUseMarketAction(game)}
                    onClick={moveHerald}
                    title="Spend 1 key to move the Herald to the other row"
                  >
                    <Sprite name="icon-key" size={13} /> Switch row
                  </button>
                  <button
                    className="btn px-2.5 py-1.5 flex items-center gap-1.5"
                    style={{ fontSize: 10 }}
                    disabled={!canUseMarketAction(game)}
                    onClick={refreshRow}
                    title="Spend 1 key to replace all 3 cards in the Herald's row"
                  >
                    <Sprite name="icon-key" size={13} /> New cards
                  </button>
                  <span className="text-parch/60" style={{ fontSize: 10 }}>
                    {canUseMarketAction(game)
                      ? 'Costs 1 key — once per turn.'
                      : player.keys < 1
                        ? 'No keys left.'
                        : 'Already used this turn.'}
                  </span>
                </div>
              )}
            </section>

            {/* Your castle */}
            <section
              className="p-2 min-w-0"
              style={{
                background: 'rgba(0,0,0,0.22)',
                border: '3px solid var(--color-ink)',
              }}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <h2
                  className="text-parch"
                  style={{ fontFamily: 'var(--font-pixel)', fontSize: 11 }}
                >
                  {castleLabel(player.name)}
                </h2>
                <span className="text-parch/60" style={{ fontSize: 10 }}>
                  {player.grid.filter(Boolean).length}/9 hired
                </span>
              </div>
              <div className="max-w-[392px] mx-auto">
                <CastleGrid
                  player={player}
                  placing={placing}
                  canInteract={isHumanTurn}
                  onPlace={(c: CellIndex) => place(c)}
                  beatingCells={game.current === 0 ? beatingCells : []}
                />
              </div>
            </section>
          </div>

          {/* ---------- Side column ---------- */}
          <aside className="space-y-3">
            <Panel title="Influence">
              <InfluenceTracks game={game} />
              <p className="mt-1.5 text-parch/60" style={{ fontSize: 10 }}>
                Leaders score at rounds 3 / 6 / 9.
              </p>
            </Panel>

            <Panel title={opponents.length > 1 ? 'Rivals' : 'Rival'}>
              <div className="space-y-2">
                {opponents.map((p) => (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    avatar={avatars[p.id] ?? 'knight'}
                    active={false}
                    showGrid={!p.isAutoma}
                  />
                ))}
              </div>
            </Panel>

            <Panel title="Edicts">
              <ul className="space-y-1">
                {game.edicts.map((e) => (
                  <li
                    key={e.id}
                    className="px-1.5 py-1 text-parch"
                    style={{
                      fontSize: 10,
                      background: 'rgba(0,0,0,0.25)',
                      border: '2px solid rgba(0,0,0,0.3)',
                    }}
                  >
                    <b style={{ fontFamily: 'var(--font-pixel)', fontSize: 9 }}>
                      {e.name}
                    </b>
                    <br />
                    <RichText text={e.text} size={11} />
                  </li>
                ))}
              </ul>
            </Panel>

            <div>
              <button
                className="btn w-full py-1.5"
                style={{ fontSize: 10 }}
                onClick={() => setLogOpen((v) => !v)}
              >
                {logOpen ? 'Hide' : 'Show'} history
              </button>
              {logOpen && (
                <div
                  className="mt-2 p-2 max-h-48 overflow-y-auto scroll-parch space-y-0.5"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '3px solid var(--color-ink)',
                  }}
                >
                  {game.log
                    .slice(-40)
                    .reverse()
                    .map((e, i) => (
                      <div
                        key={i}
                        className="text-parch/75"
                        style={{ fontSize: 10 }}
                      >
                        {e.text}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* ---------- Heartbeat flash ---------- */}
      {heartbeatRound != null && (
        <div className="fixed inset-x-0 top-3 flex justify-center pointer-events-none z-40">
          <div
            className="flex items-center gap-2 px-4 py-2 anim-pop"
            style={{
              background: '#c7442f',
              border: '3px solid var(--color-ink)',
              boxShadow: '0 4px 0 0 var(--color-ink)',
              color: '#fff6e6',
            }}
          >
            <Sprite name="icon-pulse" size={18} className="anim-beat" />
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 12 }}>
              Heartbeat — pulse powers fire
            </span>
          </div>
        </div>
      )}

      {help && <HowToPlay onClose={() => setHelp(false)} />}
    </div>
  )
}

function Panel({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      className="p-2"
      style={{
        background: 'rgba(0,0,0,0.22)',
        border: '3px solid var(--color-ink)',
      }}
    >
      <h3
        className="mb-1.5 text-parch uppercase"
        style={{ fontFamily: 'var(--font-pixel)', fontSize: 10, letterSpacing: 1 }}
      >
        {title}
      </h3>
      {children}
    </section>
  )
}
