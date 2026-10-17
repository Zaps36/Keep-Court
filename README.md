# Keep & Court

A fast, feel-good **tableau-builder**: hire characters into a 3×3 castle, watch your
combos **pulse every round**, and race the whole court for **Influence**.

Original game design. Full rules and the complete 90-card roster: [`DESIGN.md`](./DESIGN.md).

## Run it

```bash
npm install
npm run dev        # dev server
npm run build      # type-check + production build
npm run preview    # serve the build
```

## The three powers

Every card shows which powers it has, each with its own icon:

| Icon | Power | When it happens |
|------|-------|-----------------|
| ⚡ bolt | **On Hire** | once, the moment you place the card |
| ♥ heart | **Pulse** | again at the end of **every** round |
| ♛ crown | **Crown** | scores points once, at the end of the game |

Placing early means more pulses, so cheap engines compound — that is the core tension.

## Art

All pixel art is **authored in this repo as data**, not imported from anywhere:

- `tools/sprites.mjs` — every sprite as a character grid plus a palette
- `tools/png.mjs` — a dependency-free PNG encoder (uses Node's `zlib`)
- `tools/gen-art.mjs` — rasterises to `src/assets/sprites/` and writes a contact sheet

```bash
npm run art     # regenerate all 28 sprites + a review contact sheet
```

Design rules followed: a small canvas (16px icons, 32px portraits) to force readable
silhouettes, a dark outline on every sprite so it reads against any background, and a
tight light/mid/dark ramp per material so the whole set feels like one family.
Portraits are built as a shared head plus a headwear layer, which keeps the cast consistent.

Row widths are validated at generation time, so a malformed sprite fails loudly
instead of rendering as garbage.

## Tech stack

| Layer | Choice |
|---|---|
| Build | **Vite 8** (Rolldown) |
| UI | **React 19** + **TypeScript 6** |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`) |
| State | **Zustand** |
| Fonts | **Silkscreen** + **Press Start 2P**, bundled via `@fontsource` (no CDN) |

Game logic lives in a **pure, UI-agnostic engine** (`src/engine/`) with zero React
imports, so it can back AI, solo, hotseat, daily puzzles, or future online play.

## Project layout

```
tools/               Pixel-art pipeline + UI test harness
src/
  engine/            Pure game engine (no React)
    types.ts         Core types and constants
    cards.ts         90-card roster + 18 edicts (canonical data)
    grid.ts          3x3 geometry
    rng.ts           Seeded RNG (daily puzzles)
    effects.ts       On Hire / Pulse / end-game resolution
    edicts.ts        Shared-objective scoring
    engine.ts        Setup, turn flow, Heartbeat, era + final scoring
    ai.ts            Heuristic drafting bot
    selfcheck.ts     200-game simulation with invariant assertions
  store/gameStore.ts Zustand wrapper (also holds avatars + animation state)
  components/        React UI
  assets/sprites/    Generated PNGs — do not hand-edit, run `npm run art`
```

## Modes

- **vs Bots** — 1–3 heuristic AI rivals
- **Solo** — race the influence-only Steward (easy / normal / hard)
- **Hotseat** — 2–4 players sharing one device
- **Daily** — everyone gets the same deck order today (date-seeded)

## Testing

```bash
npm run selfcheck   # 200 AI-vs-AI games, asserts engine invariants
npm run uitest bot  # drives a real browser through a whole game
npm run test:all    # engine + build + all four modes
```

The UI harness plays a complete game with real clicks and fails on console errors,
broken sprites, clipped layout, leftover emoji, or a board that will not fit a laptop
screen. Screenshots land in `.kiro/artifacts/screenshots/` for visual review.
