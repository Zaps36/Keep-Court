import { legalPlacements } from '../engine/grid'
import type { CellIndex, PlayerState } from '../engine/types'
import { CardView } from './CardView'

interface Props {
  player: PlayerState
  active: boolean
  awaitingPlacement: boolean
  perCard?: Record<number, number>
  onPlace?: (cell: CellIndex) => void
}

export function GridView({ player, active, awaitingPlacement, perCard, onPlace }: Props) {
  const legal = awaitingPlacement ? legalPlacements(player.grid) : []

  return (
    <div
      className="grid grid-cols-3 gap-1.5 p-2 rounded-xl inset-panel"
      style={{ background: 'rgba(0,0,0,0.25)' }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const placed = player.grid[i]
        const isLegal = legal.includes(i as CellIndex)
        return (
          <div key={i} className="relative aspect-[3/4]">
            {placed ? (
              <div className="w-full h-full">
                <CardView
                  card={placed.def}
                  faceDown={placed.faceDown}
                  compact
                  disabled
                  cofferCoins={placed.cofferCoins}
                />
                {perCard && perCard[i] != null && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full card-shadow">
                    {perCard[i]}⭐
                  </span>
                )}
              </div>
            ) : (
              <button
                data-testid={isLegal ? 'legal-cell' : 'empty-cell'}
                disabled={!isLegal || !active}
                onClick={() => isLegal && onPlace?.(i as CellIndex)}
                className={`w-full h-full rounded-lg border-2 border-dashed transition ${
                  isLegal
                    ? 'border-amber-300 bg-amber-300/15 hover:bg-amber-300/30 animate-pop cursor-pointer'
                    : 'border-white/10 bg-black/20'
                }`}
              >
                {isLegal && <span className="text-amber-200 text-2xl">+</span>}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
