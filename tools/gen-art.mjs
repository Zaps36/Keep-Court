// Rasterise all pixel art to PNG. Run: npm run art
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { blank, blit, encodePNG, compose, render, upscale } from './png.mjs'
import {
  AVATARS,
  EMBLEMS,
  HEAD_BASE,
  ICONS,
  ICON_SHIELD,
  PAL,
  ROW_ERRORS,
  SHIELD_RAMPS,
} from './sprites.mjs'

if (ROW_ERRORS.length) {
  console.error(`\n${ROW_ERRORS.length} row width problem(s):\n`)
  for (const e of ROW_ERRORS) console.error('  - ' + e)
  console.error('')
  process.exit(1)
}

const OUT = join(process.cwd(), 'src/assets/sprites')
mkdirSync(OUT, { recursive: true })

const written = []

function validate(name, grid, expect) {
  if (grid.length !== expect) {
    throw new Error(`${name}: has ${grid.length} rows, expected ${expect}`)
  }
  for (let y = 0; y < grid.length; y++) {
    if (grid[y].length !== expect) {
      throw new Error(
        `${name}: row ${y} width ${grid[y].length}, expected ${expect}\n"${grid[y]}"`,
      )
    }
  }
}

function save(name, img) {
  writeFileSync(join(OUT, name + '.png'), encodePNG(img.width, img.height, img.rgba))
  written.push(name)
}

// --- icons (16x16) ---------------------------------------------------------
const iconImages = {}
for (const [name, grid] of Object.entries(ICONS)) {
  validate(`icon:${name}`, grid, 16)
  const img = render(grid, PAL)
  iconImages[name] = img
  save('icon-' + name, img)
}

// --- faction shields (palette swaps) --------------------------------------
validate('shield', ICON_SHIELD, 16)
for (const [code, ramp] of Object.entries(SHIELD_RAMPS)) {
  const img = render(ICON_SHIELD, { ...PAL, ...ramp })
  iconImages['shield-' + code] = img
  save('shield-' + code.toLowerCase(), img)
}

// --- faction emblems ------------------------------------------------------
for (const [code, grid] of Object.entries(EMBLEMS)) {
  validate(`emblem:${code}`, grid, 16)
  const ramp = SHIELD_RAMPS[code]
  const img = render(grid, { ...PAL, ...ramp })
  iconImages['emblem-' + code] = img
  save('emblem-' + code.toLowerCase(), img)
}

// --- avatars (32x32) ------------------------------------------------------
validate('head-base', HEAD_BASE, 32)
const avatarImages = {}
for (const av of AVATARS) {
  validate(`avatar:${av.id}`, av.layer, 32)
  const grid = compose(HEAD_BASE, av.layer)
  const img = render(grid, { ...PAL, ...av.pal })
  avatarImages[av.id] = img
  save('avatar-' + av.id, img)
}

// --- contact sheet for visual review -------------------------------------
{
  const scale = 5
  const pad = 6
  const iconEntries = Object.entries(iconImages)
  const cols = 8
  const cellW = 16 * scale + pad * 2
  const cellH = 16 * scale + pad * 2
  const iconRows = Math.ceil(iconEntries.length / cols)

  const avEntries = Object.entries(avatarImages)
  const avCellW = 32 * scale + pad * 2
  const avCellH = 32 * scale + pad * 2
  const avRows = Math.ceil(avEntries.length / cols)

  const W = Math.max(cols * cellW, cols * avCellW)
  const H = iconRows * cellH + avRows * avCellH + pad * 4
  const sheet = blank(W, H, '#f4ecd8')

  iconEntries.forEach(([, img], i) => {
    const cx = (i % cols) * cellW + pad
    const cy = Math.floor(i / cols) * cellH + pad
    blit(sheet, upscale(img, scale), cx, cy)
  })

  const yOffset = iconRows * cellH + pad * 2
  avEntries.forEach(([, img], i) => {
    const cx = (i % cols) * avCellW + pad
    const cy = yOffset + Math.floor(i / cols) * avCellH + pad
    blit(sheet, upscale(img, scale), cx, cy)
  })

  mkdirSync(join(process.cwd(), '.kiro/artifacts/screenshots'), { recursive: true })
  writeFileSync(
    join(process.cwd(), '.kiro/artifacts/screenshots/sprite-sheet.png'),
    encodePNG(sheet.width, sheet.height, sheet.rgba),
  )
  console.log('Contact sheet -> .kiro/artifacts/screenshots/sprite-sheet.png')
  console.log('  icons:', iconEntries.map(([n]) => n).join(', '))
  console.log('  avatars:', avEntries.map(([n]) => n).join(', '))
}

console.log(`\nWrote ${written.length} sprites to src/assets/sprites/`)
