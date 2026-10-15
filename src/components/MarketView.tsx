import { affordableIndices, cur, effectiveCost, mustGoVagabond } from '../engine/engine'
import type { DeckId, GameState } from '../engine/types'
import { CardView } from './CardView'

interface Props {
  game: GameState
  interactive: boolean
  onBuy: (deck: DeckId, index: number) => void
  onVagabond: (deck: DeckId, index: number) => void
}

export function MarketView({ game, interactive, onBuy, onVagabond }: Props) {
  const player = cur(game)
  const forced = mustGoVagabond(game)
  const affordable = new Set(affordableIndices(game))

  const renderRow = (deck: DeckId) => {
    const isHeraldRow = game.herald === deck
    return (
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: deck === 'Keep' ? '#9bb4e8' : '#e8ac9b' }}
          >
            {deck === 'Keep' ? '🏰 The Keep (Nobility)' : '🏘️ The Court (Commons)'}
          </span>
          {isHeraldRow && (
            <span className="text-[10px] bg-amber-400 text-black px-1.5 py-0.5 rounded-full font-bold animate-pop">
              📯 Herald here
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {game.market[deck].map((card, i) => {
            if (!card)
              return (
                <div key={i} className="w-32 h-44 rounded-lg border-2 border-dashed border-white/10" />
              )
            const canBuyHere =
              interactive &&
              game.phase === 'awaitingBuy' &&
              isHeraldRow &&
              !forced &&
              affordable.has(i)
            const canVagabondHere =
              interactive && game.phase === 'awaitingBuy' && forced

            return (
              <CardView
                key={card.id}
                card={card}
                testid={canBuyHere ? 'buyable' : canVagabondHere ? 'vagabond-pick' : undefined}
                cost={effectiveCost(player, card)}
                affordable={!isHeraldRow || affordable.has(i) || forced}
                disabled={!canBuyHere && !canVagabondHere}
                onClick={() => {
                  if (canBuyHere) onBuy(deck, i)
                  else if (canVagabondHere) onVagabond(deck, i)
                }}
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {renderRow('Keep')}
      {renderRow('Court')}
      {forced && interactive && game.phase === 'awaitingBuy' && (
        <p className="text-xs text-rose-300 bg-rose-900/30 rounded px-3 py-2">
          ⚠️ You can't afford any card in the Herald's row. Pick any card to take it
          <b> face-down</b> (+5🪙 +2🗝️).
        </p>
      )}
    </div>
  )
}
