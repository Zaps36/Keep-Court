import { useEffect, useRef } from 'react'
import { GridView } from './components/GridView'
import { InfluenceBoard, PLAYER_COLORS } from './components/InfluenceBoard'
import { MarketView } from './components/MarketView'
import { ScoreScreen } from './components/ScoreScreen'
import { SetupScreen } from './components/SetupScreen'
import { canUseMarketAction, cur } from './engine/engine'
import type { CellIndex } from './engine/types'
import { TOTAL_ROUNDS } from './engine/types'
import { useGame } from './store/gameStore'

export default function App() {
  const game = useGame((s) => s.game)
  const aiPlayers = useGame((s) => s.aiPlayers)
  const { newGame, moveHerald, refreshRow, buy, vagabond, place } = useGame()

  if (!game) {
    return <SetupScreen onStart={(cfg, ai) => newGame(cfg, ai)} />
  }

  if (game.phase === 'gameOver') {
    return <ScoreScreen game={game} onNewGame={() => useGame.setState({ game: null })} />
  }

  const player = cur(game)
  const isHumanTurn = !aiPlayers.has(game.current) && !player.isAutoma
  const awaitingPlacement = game.phase === 'awaitingPlacement'

  return (
    <div className="min-h-screen p-3 md:p-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-amber-100" style={{ fontFamily: 'var(--font-display)' }}>
          Keep &amp; Court
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-amber-200/80">
            Round <b className="text-amber-100">{game.round}</b>/{TOTAL_ROUNDS}
          </span>
          <span className="text-amber-200/80">
            Era <b className="text-amber-100">{game.era}</b>
          </span>
          <button
            onClick={() => useGame.setState({ game: null })}
            className="text-xs text-amber-200/50 hover:text-amber-100 underline"
          >
            quit
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        {/* LEFT: market + current player board */}
        <div className="space-y-4">
          {/* Turn banner */}
          <div
            className="rounded-xl px-4 py-2 flex items-center justify-between"
            style={{ background: `${PLAYER_COLORS[game.current % 4]}22`, border: `1px solid ${PLAYER_COLORS[game.current % 4]}55` }}
          >
            <span className="font-semibold text-amber-100">
              {player.isAutoma
                ? '🤖 Steward is advancing influence…'
                : aiPlayers.has(game.current)
                  ? `🤖 ${player.name} is thinking…`
                  : `${player.name}'s turn`}
            </span>
            <span className="text-sm">
              {awaitingPlacement ? '📍 Place your card' : '🛒 Buy a card'}
            </span>
          </div>

          {/* Market */}
          <div className="rounded-xl bg-black/20 p-3">
            <MarketView
              game={game}
              interactive={isHumanTurn}
              onBuy={buy}
              onVagabond={vagabond}
            />
            {/* Market actions */}
            {isHumanTurn && game.phase === 'awaitingBuy' && (
              <div className="flex gap-2 mt-3">
                <button
                  disabled={!canUseMarketAction(game)}
                  onClick={moveHerald}
                  className="text-xs rounded-lg px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-amber-100"
                >
                  🗝️ Move Herald (−1 key)
                </button>
                <button
                  disabled={!canUseMarketAction(game)}
                  onClick={refreshRow}
                  className="text-xs rounded-lg px-3 py-1.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 text-amber-100"
                >
                  🔄 Refresh row (−1 key)
                </button>
              </div>
            )}
          </div>

          {/* Pending placement choices */}
          {isHumanTurn && awaitingPlacement && game.pendingPlacement && (
            <PlacementBanner />
          )}

          {/* Current player grid */}
          <div className="rounded-xl bg-black/20 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-amber-100">{player.name}'s Castle</h3>
              <ResourceBar coins={player.coins} keys={player.keys} />
            </div>
            <div className="max-w-sm mx-auto">
              <GridView
                player={player}
                active={isHumanTurn}
                awaitingPlacement={awaitingPlacement}
                onPlace={(cell: CellIndex) => place(cell)}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: influence, opponents, log */}
        <div className="space-y-4">
          <InfluenceBoard game={game} />

          {/* Opponents mini-boards */}
          <div className="space-y-3">
            {game.players
              .filter((p) => p.id !== game.current && !p.isAutoma)
              .map((p) => (
                <div key={p.id} className="rounded-xl bg-black/20 p-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-amber-100 flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ background: PLAYER_COLORS[p.id % 4] }} />
                      {p.name}
                    </span>
                    <ResourceBar coins={p.coins} keys={p.keys} small />
                  </div>
                  <div className="max-w-[180px]">
                    <GridView player={p} active={false} awaitingPlacement={false} />
                  </div>
                </div>
              ))}
          </div>

          {/* Log */}
          <LogPanel />
        </div>
      </div>
    </div>
  )
}

function ResourceBar({ coins, keys, small }: { coins: number; keys: number; small?: boolean }) {
  return (
    <div className={`flex gap-3 ${small ? 'text-xs' : 'text-sm'} font-semibold`}>
      <span className="text-yellow-300">🪙 {coins}</span>
      <span className="text-amber-200">🗝️ {keys}</span>
    </div>
  )
}

function PlacementBanner() {
  const game = useGame((s) => s.game)!
  const { pendingChoices, setChoices } = useGame()
  const card = game.pendingPlacement!.def
  const hasHeraldChoice =
    !game.pendingPlacement!.faceDown &&
    typeof card.onHire === 'string' &&
    card.onHire.includes('mayMoveHerald')

  return (
    <div className="rounded-xl bg-amber-400/10 border border-amber-400/40 px-4 py-2 flex items-center justify-between gap-3">
      <span className="text-sm text-amber-100">
        Placing <b>{card.name}</b> — pick a highlighted cell.
      </span>
      {hasHeraldChoice && (
        <label className="text-xs flex items-center gap-1.5 text-amber-200">
          <input
            type="checkbox"
            checked={!!pendingChoices.moveHerald}
            onChange={(e) => setChoices({ moveHerald: e.target.checked })}
          />
          move Herald
        </label>
      )}
    </div>
  )
}

function LogPanel() {
  const game = useGame((s) => s.game)!
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight })
  }, [game.log.length])

  const icon: Record<string, string> = {
    buy: '🛒',
    place: '📍',
    effect: '⚡',
    pulse: '💓',
    era: '🏆',
    score: '🏁',
    system: '•',
  }

  return (
    <div className="rounded-xl bg-black/30 p-3 inset-panel">
      <h3 className="text-sm font-semibold text-amber-100 mb-2">Chronicle</h3>
      <div ref={ref} className="h-48 overflow-y-auto space-y-1 text-[11px] text-amber-200/70 pr-1">
        {game.log.slice(-60).map((e, i) => (
          <div key={i} className="flex gap-1.5">
            <span className="opacity-60">{icon[e.kind] ?? '•'}</span>
            <span>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
