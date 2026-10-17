import { legalPlacements } from '../engine/grid'
import type { CellIndex, PlayerState } from '../engine/types'
import { Card } from './Card'
import { Sprite } from './Sprite'

interface Props {
  player: PlayerState
  /** Highlight empty cells the player may place into. */
  placing?: boolean
  canInteract?: boolean
  onPlace?: (cell: CellIndex) => void
  perCard?: Record<number, number>
  /** Cells whose pulse fired this tick (animation). */
  beatingCells?: number[]
}

export function CastleGrid({
  player,
  placing,
  canInteract,
  onPlace,
  perCard,
  beatingCells = [],
}: Props) {
  const legal = placing ? legalPlacements(player.grid) : []

  return (
    <div
      className="grid grid-cols-3 gap-1.5 p-2"
      style={{
        background: '#5d3c21',
        border: '3px solid var(--color-ink)',
        boxShadow: 'inset 0 0 0 3px rgba(0,0,0,0.18)',
      }}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const placed = player.grid[i]
        const isLegal = legal.includes(i as CellIndex)

        if (placed) {
          return (
            <div key={i} className="relative aspect-[3/4] anim-pop">
              <Card
                card={placed.def}
                size="grid"
                faceDown={placed.faceDown}
                cofferCoins={placed.cofferCoins}
                vp={perCard?.[i]}
                beating={beatingCells.includes(i)}
              />
            </div>
          )
        }

        return (
          <button
            key={i}
            data-testid={isLegal ? 'legal-cell' : 'empty-cell'}
            disabled={!isLegal || !canInteract}
            onClick={() => isLegal && onPlace?.(i as CellIndex)}
            aria-label={isLegal ? 'Place card here' : 'Empty slot'}
            className={`relative aspect-[3/4] flex items-center justify-center ${
              isLegal ? 'anim-slot cursor-pointer' : ''
            }`}
            style={{
              border: isLegal
                ? '3px dashed var(--color-gold-light)'
                : '3px dashed rgba(0,0,0,0.3)',
              background: isLegal ? undefined : 'rgba(0,0,0,0.18)',
            }}
          >
            {isLegal && (
              <span
                className="text-gold-light"
                style={{ fontFamily: 'var(--font-pixel)', fontSize: 20 }}
              >
                +
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Compact 3x3 for opponents. */
export function MiniGrid({ player }: { player: PlayerState }) {
  return (
    <div className="grid grid-cols-3 gap-[3px] w-[72px]">
      {Array.from({ length: 9 }, (_, i) => {
        const placed = player.grid[i]
        return (
          <div key={i} className="aspect-square">
            {placed ? (
              placed.faceDown ? (
                <div
                  className="w-full h-full"
                  style={{ background: '#6b4324', border: '1px solid #1a1109' }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: 'var(--color-parch)',
                    border: '1px solid var(--color-ink)',
                  }}
                  title={placed.def.name}
                >
                  <Sprite
                    name={`emblem-${placed.def.shields[0].toLowerCase()}`}
                    size={12}
                  />
                </div>
              )
            ) : (
              <div
                className="w-full h-full"
                style={{ background: 'rgba(0,0,0,0.25)' }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
