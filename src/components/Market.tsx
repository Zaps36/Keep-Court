import { affordableIndices, cur, effectiveCost, mustGoVagabond } from '../engine/engine'
import type { DeckId, GameState } from '../engine/types'
import { Card } from './Card'
import { Sprite } from './Sprite'

interface Props {
  game: GameState
  interactive: boolean
  onBuy: (deck: DeckId, index: number) => void
  onVagabond: (deck: DeckId, index: number) => void
}

export function Market({ game, interactive, onBuy, onVagabond }: Props) {
  const player = cur(game)
  const forced = mustGoVagabond(game)
  const affordable = new Set(affordableIndices(game))
  const buying = interactive && game.phase === 'awaitingBuy'

  const Row = ({ deck }: { deck: DeckId }) => {
    const isHeraldRow = game.herald === deck
    const isKeep = deck === 'Keep'
    return (
      <div
        className="relative flex items-center gap-2 px-2 py-1.5"
        style={{
          background: isHeraldRow ? 'rgba(255,217,107,0.16)' : 'transparent',
          border: isHeraldRow
            ? '3px solid var(--color-gold-light)'
            : '3px solid transparent',
        }}
      >
        {/* row label + herald marker */}
        <div className="w-[66px] shrink-0 flex flex-col items-center gap-1">
          <span
            className="px-1.5 py-0.5 text-center leading-tight text-parch"
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: 9,
              background: isKeep ? 'var(--color-keep)' : 'var(--color-court)',
              border: '2px solid var(--color-ink)',
            }}
          >
            {isKeep ? 'THE KEEP' : 'THE COURT'}
          </span>
          {isHeraldRow ? (
            <span className="flex flex-col items-center anim-pop">
              <Sprite name="icon-herald" size={22} />
              <span
                className="text-gold-light"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: 7 }}
              >
                BUY HERE
              </span>
            </span>
          ) : (
            <span
              className="text-parch/40"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: 7 }}
            >
              locked row
            </span>
          )}
        </div>

        {/* the three cards */}
        <div className="flex gap-2 items-stretch">
          {game.market[deck].map((card, i) => {
            if (!card)
              return (
                <div
                  key={i}
                  className="w-[130px] min-h-[150px]"
                  style={{ border: '3px dashed rgba(0,0,0,0.25)' }}
                />
              )

            const canBuy = buying && isHeraldRow && !forced && affordable.has(i)
            const canTakeDown = buying && forced
            const locked = isHeraldRow && !affordable.has(i) && !forced

            return (
              <Card
                key={card.id}
                card={card}
                cost={effectiveCost(player, card)}
                locked={locked}
                inactive={!isHeraldRow && !forced}
                testid={canBuy ? 'buyable' : canTakeDown ? 'vagabond-pick' : undefined}
                className={canBuy ? 'anim-deal' : ''}
                onClick={
                  canBuy
                    ? () => onBuy(deck, i)
                    : canTakeDown
                      ? () => onVagabond(deck, i)
                      : undefined
                }
              />
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <Row deck="Keep" />
      <Row deck="Court" />
      {forced && buying && (
        <div
          className="flex items-start gap-2 px-3 py-2 anim-shake"
          style={{
            background: '#c7442f',
            border: '3px solid var(--color-ink)',
            color: '#fff6e6',
            fontFamily: 'var(--font-body)',
            fontSize: 12,
          }}
        >
          <Sprite name="icon-lock" size={16} className="mt-px" />
          <p className="leading-snug">
            Too expensive! Pick any card to take it <b>face-down</b> — it scores
            nothing, but you gain{' '}
            <span className="whitespace-nowrap">
              <Sprite name="icon-coin" size={13} /> 5
            </span>{' '}
            and{' '}
            <span className="whitespace-nowrap">
              <Sprite name="icon-key" size={13} /> 2
            </span>
            .
          </p>
        </div>
      )}
    </div>
  )
}
