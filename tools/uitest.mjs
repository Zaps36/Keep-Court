// Headless UI test: serves dist/, plays a full game via real clicks, captures
// screenshots at every key moment, and fails on console errors or broken art.
// Run: node tools/uitest.mjs [mode]
import { readFile, mkdir } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

const MODE = process.argv[2] ?? 'bot'
const SHOTS = '.kiro/artifacts/screenshots'
await mkdir(SHOTS, { recursive: true })

const DIST = join(process.cwd(), 'dist')
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p === '/') p = '/index.html'
  let file = join(DIST, p)
  let body
  try {
    body = await readFile(file)
  } catch {
    body = await readFile(join(DIST, 'index.html'))
    file = 'index.html'
  }
  res.writeHead(200, {
    'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
  })
  res.end(body)
})
await new Promise((r) => server.listen(0, r))
const base = `http://localhost:${server.address().port}/`

// A realistic laptop viewport — the board should fit without hunting.
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({
  viewport: { width: 1366, height: 820 },
  deviceScaleFactor: 2,
})

const errors = []
const failedRequests = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text())
})
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('requestfailed', (r) => failedRequests.push(r.url()))

const shot = async (name) => {
  await page.screenshot({ path: `${SHOTS}/${name}.png` })
  console.log(`  shot: ${name}`)
}

const problems = []
const check = (cond, msg) => {
  if (cond) console.log(`  ok: ${msg}`)
  else {
    console.log(`  FAIL: ${msg}`)
    problems.push(msg)
  }
}

console.log(`\n=== UI test (mode: ${MODE}) ===`)
await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForTimeout(400)

// --- 1. First load shows the primer -------------------------------------
const primerVisible = await page.getByText('Fill your 3x3 castle').count()
check(primerVisible > 0, 'how-to-play primer shows on first visit')
await shot('01-howtoplay')

// step through the primer
for (let i = 0; i < 6; i++) {
  const next = page.getByRole('button', { name: /^Next$|Let's play/ })
  if ((await next.count()) === 0) break
  await next.first().click()
  await page.waitForTimeout(150)
}
await page.waitForTimeout(250)

// --- 2. Setup screen -----------------------------------------------------
check(
  (await page.getByText('Your portrait').count()) > 0,
  'setup screen with avatar picker',
)
await shot('02-setup')

// pick a different avatar to prove the picker works
const avatarBtns = page.locator('button[title]').filter({ has: page.locator('img') })
if ((await avatarBtns.count()) > 2) {
  await avatarBtns.nth(2).click()
  await page.waitForTimeout(120)
}

// choose mode
const modeName = { bot: /vs Bots/, solo: /Solo/, hotseat: /Hotseat/, daily: /Daily/ }[MODE]
await page.getByRole('button', { name: modeName }).first().click()
await page.waitForTimeout(120)
await shot('03-setup-chosen')

await page.getByRole('button', { name: /^Begin$/ }).click()
await page.waitForTimeout(700)

// --- 3. In game ----------------------------------------------------------
check((await page.getByText(/Castle/).count()) > 0, 'game board rendered')
check(
  (await page.getByText(/Buy a card from/).count()) > 0 ||
    (await page.getByText(/is taking their turn/).count()) > 0,
  'instruction bar tells the player what to do',
)
await shot('04-game-start')

// Verify every sprite actually loaded (catches bad import paths)
const brokenImgs = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img.pixel'))
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => i.getAttribute('src')),
)
check(brokenImgs.length === 0, `all pixel sprites loaded (${brokenImgs.length} broken)`)
if (brokenImgs.length) console.log('    broken:', brokenImgs.slice(0, 5))

// Verify power icons appear on market cards
const onhireIcons = await page.locator('[data-sprite="icon-onhire"]').count()
const pulseIcons = await page.locator('[data-sprite="icon-pulse"]').count()
const crownIcons = await page.locator('[data-sprite="icon-crown"]').count()
check(
  onhireIcons + pulseIcons + crownIcons > 0,
  `power icons render (onhire=${onhireIcons} pulse=${pulseIcons} crown=${crownIcons})`,
)

// Nothing important should be clipped horizontally
const clipped = await page.evaluate(() => {
  const bad = []
  for (const el of document.querySelectorAll('.overflow-x-auto')) {
    if (el.scrollWidth > el.clientWidth + 2)
      bad.push(`${el.className.slice(0, 30)} ${el.scrollWidth}>${el.clientWidth}`)
  }
  return bad
})
check(clipped.length === 0, `market not clipped (${clipped.join('; ')})`)

// The whole board should be reachable without a huge scroll on a laptop
const pageH = await page.evaluate(() => document.documentElement.scrollHeight)
const viewH = await page.evaluate(() => window.innerHeight)
check(
  pageH <= viewH * 1.35,
  `board roughly fits a laptop screen (page ${pageH}px vs view ${viewH}px)`,
)

// Verify no raw emoji leaked into the DOM
const emojiLeak = await page.evaluate(() => {
  const re = /[\u{1FA99}\u{1F5DD}\u{1F45B}\u2B50\u26A1\u{1F493}]/u
  const hits = []
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  let n
  while ((n = walk.nextNode())) {
    if (re.test(n.textContent)) hits.push(n.textContent.trim().slice(0, 40))
  }
  return hits
})
check(emojiLeak.length === 0, `no emoji left in UI (${emojiLeak.length} found)`)
if (emojiLeak.length) console.log('    leaked:', emojiLeak.slice(0, 5))

// --- 4. Play the whole game ---------------------------------------------
let placements = 0
let sawPlacementPrompt = false
let shotPlacing = false
let shotMid = false
const deadline = Date.now() + 90000

while (Date.now() < deadline) {
  if (await page.getByText(/wins$/).count()) break

  const legal = page.locator('[data-testid="legal-cell"]')
  const buyable = page.locator('[data-testid="buyable"]')
  const vagabond = page.locator('[data-testid="vagabond-pick"]')

  if ((await legal.count()) > 0) {
    sawPlacementPrompt = true
    if (!shotPlacing) {
      await shot('05-placing')
      shotPlacing = true
    }
    await legal.first().click({ timeout: 2500 }).catch(() => {})
    placements++
    await page.waitForTimeout(160)
    if (placements === 4 && !shotMid) {
      await page.waitForTimeout(500)
      await shot('06-midgame')
      shotMid = true
    }
    continue
  }
  if ((await buyable.count()) > 0) {
    await buyable.first().click({ timeout: 2500 }).catch(() => {})
    await page.waitForTimeout(160)
    continue
  }
  if ((await vagabond.count()) > 0) {
    await vagabond.first().click({ timeout: 2500 }).catch(() => {})
    await page.waitForTimeout(160)
    continue
  }
  await page.waitForTimeout(220)
}

check(sawPlacementPrompt, 'placement slots were highlighted')
// Hotseat drives two human seats, so the harness places for both of them.
const expectedPlacements = MODE === 'hotseat' ? 18 : 9
check(
  placements === expectedPlacements,
  `made ${expectedPlacements} placements (made ${placements})`,
)

// --- 5. Score screen -----------------------------------------------------
const won = (await page.getByText(/wins$/).count()) > 0
check(won, 'reached the score screen')
await page.waitForTimeout(1100) // let the count-up finish
await shot('07-score')

// per-card VP badges on the final castle
const vpBadges = await page.locator('[data-sprite="icon-crown"]').count()
check(vpBadges > 0, 'score screen shows crown/VP art')

// --- 6. Mobile layout sanity --------------------------------------------
await page.setViewportSize({ width: 414, height: 900 })
await page.waitForTimeout(300)
await shot('08-mobile-score')
const hScroll = await page.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 2,
)
check(!hScroll, 'no horizontal page overflow on mobile')

// --- report --------------------------------------------------------------
console.log('\n--- results ---')
check(errors.length === 0, `no console errors (${errors.length})`)
if (errors.length) errors.slice(0, 8).forEach((e) => console.log('    ' + e))
const realFails = failedRequests.filter((u) => !u.includes('favicon'))
check(realFails.length === 0, `no failed requests (${realFails.length})`)
if (realFails.length) realFails.slice(0, 5).forEach((u) => console.log('    ' + u))

await browser.close()
server.close()

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`)
  problems.forEach((p) => console.log('  - ' + p))
  process.exitCode = 1
} else {
  console.log('\nAll UI checks passed.')
}
