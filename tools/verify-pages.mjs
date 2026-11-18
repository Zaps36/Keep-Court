// Verifies the GitHub Pages build: serves dist/ under a sub-path (exactly how
// github.io does) and confirms the app boots with no broken assets.
// Run: BASE_PATH=/Keep-Court/ npm run build && node tools/verify-pages.mjs /Keep-Court/
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join } from 'node:path'
import { chromium } from 'playwright'

const PREFIX = (process.argv[2] ?? '/Keep-Court/').replace(/\/?$/, '/')
const DIST = join(process.cwd(), 'dist')
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

const missing = []
const server = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0])
  // Only serve under the prefix, like GitHub Pages project sites do.
  if (!url.startsWith(PREFIX)) {
    missing.push(url)
    res.writeHead(404)
    res.end('not found (outside base path)')
    return
  }
  let rel = url.slice(PREFIX.length)
  if (rel === '') rel = 'index.html'
  try {
    const body = await readFile(join(DIST, rel))
    res.writeHead(200, {
      'Content-Type': MIME[extname(rel)] ?? 'application/octet-stream',
    })
    res.end(body)
  } catch {
    missing.push(url)
    res.writeHead(404)
    res.end('not found')
  }
})
await new Promise((r) => server.listen(0, r))
const root = `http://localhost:${server.address().port}${PREFIX}`

const problems = []
const check = (cond, msg) => {
  console.log(`  ${cond ? 'ok' : 'FAIL'}: ${msg}`)
  if (!cond) problems.push(msg)
}

console.log(`\n=== Pages build check (served at ${PREFIX}) ===`)

// 1. index.html must reference prefixed asset URLs
const html = await readFile(join(DIST, 'index.html'), 'utf8')
const srcs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1])
const localAbs = srcs.filter((s) => s.startsWith('/'))
check(localAbs.length > 0, `index.html has absolute asset URLs (${localAbs.length})`)
check(
  localAbs.every((s) => s.startsWith(PREFIX)),
  `all absolute URLs use ${PREFIX} -> ${localAbs.join(' , ')}`,
)

// 2. The app must actually boot from that sub-path
const browser = await chromium.launch({ args: ['--no-sandbox'] })
const page = await browser.newPage({ viewport: { width: 1366, height: 820 } })
const errors = []
const failed = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('requestfailed', (r) => failed.push(r.url()))
page.on('response', (r) => {
  if (r.status() >= 400 && !r.url().includes('favicon')) failed.push(`${r.status()} ${r.url()}`)
})

await page.goto(root, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)

const booted = await page.getByText('KEEP').count()
check(booted > 0, 'app rendered (title visible)')

// dismiss the primer and reach the setup screen
for (let i = 0; i < 6; i++) {
  const next = page.getByRole('button', { name: /^Next$|Let's play/ })
  if ((await next.count()) === 0) break
  await next.first().click()
  await page.waitForTimeout(120)
}
check(
  (await page.getByText('Your portrait').count()) > 0,
  'setup screen reachable',
)

// 3. Every sprite and font must have loaded
const broken = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img.pixel'))
    .filter((i) => !i.complete || i.naturalWidth === 0)
    .map((i) => i.getAttribute('data-sprite')),
)
check(broken.length === 0, `all sprites loaded (${broken.length} broken)`)
if (broken.length) console.log('    broken:', broken.slice(0, 6))

const pixelFontLoaded = await page.evaluate(() =>
  document.fonts.check('12px Silkscreen'),
)
check(pixelFontLoaded, 'pixel font loaded')

// start a game to exercise the in-game assets too
await page.getByRole('button', { name: /^Begin$/ }).click()
await page.waitForTimeout(900)
check((await page.getByText(/Castle/).count()) > 0, 'game starts from sub-path')

const brokenInGame = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img.pixel'))
    .filter((i) => !i.complete || i.naturalWidth === 0).length,
)
check(brokenInGame === 0, `in-game sprites loaded (${brokenInGame} broken)`)

await page.screenshot({ path: '.kiro/artifacts/screenshots/pages-build.png' })

check(errors.length === 0, `no console errors (${errors.length})`)
errors.slice(0, 6).forEach((e) => console.log('    ' + e))
check(failed.length === 0, `no 404s / failed requests (${failed.length})`)
failed.slice(0, 8).forEach((u) => console.log('    ' + u))

const outside = missing.filter((u) => !u.includes('favicon'))
check(
  outside.length === 0,
  `nothing requested outside the base path (${outside.length})`,
)
outside.slice(0, 8).forEach((u) => console.log('    ' + u))

await browser.close()
server.close()

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`)
  problems.forEach((p) => console.log('  - ' + p))
  process.exitCode = 1
} else {
  console.log('\nPages build is good.')
}
