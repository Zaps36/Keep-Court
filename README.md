# Keep & Court

A fast, feel-good **tableau-builder**: shop characters into a 3×3 castle, watch your
combos **pulse (the Heartbeat)** every round, and race the whole court for **Influence**.
An original game that shares DNA with the "shop-and-grid" family but adds a living
engine, a shared majority race, and variable objectives.

> Full rules & the complete 90-card roster live in [`DESIGN.md`](./DESIGN.md).

## Tech stack (latest as of Oct 2026)

| Layer | Choice |
|---|---|
| Build | **Vite 8** (Rolldown / Rust toolchain) |
| UI | **React 19** + **TypeScript 6** |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`) |
| State | **Zustand** |
| Lint | **oxlint** |

The game logic lives in a **pure, UI-agnostic engine** (`src/engine/`) so it can be
reused for AI, solo, hotseat, or future online play. React is only the presentation layer.

## Run it

```bash
npm install
npm run dev        # dev server
npm run build      # type-check + production build
npm run preview    # serve the build
```

## Project layout

```
src/
  engine/            Pure game engine (no React)
    types.ts         Core types & constants
    cards.ts         Full 90-card roster + 18 edicts (canonical data)
    grid.ts          3×3 geometry helpers
    rng.ts           Seedable RNG (daily puzzles)
    effects.ts       onHire / pulse / endgame effect resolution
    edicts.ts        Shared-objective scoring
    engine.ts        Setup, turn flow, Heartbeat, Era & final scoring
    ai.ts            Heuristic drafting bot
    selfcheck.ts     Dev simulation (npx tsx src/engine/selfcheck.ts)
  store/
    gameStore.ts     Zustand wrapper over the engine
  components/        React UI (board, market, influence, cards, screens)
  App.tsx            Composition root
```

## Modes

- **vs Bots** — 1–3 heuristic AI opponents
- **Solo** — race the influence-only Steward automa (easy/normal/hard)
- **Hotseat** — 2–4 humans on one device
- **Daily Puzzle** — everyone gets the same deck order today (seeded)

## Verifying correctness

- `npx tsx src/engine/selfcheck.ts` runs 200 AI-vs-AI games across 2–4 players and
  asserts invariants (full 9-card grids, no negative resources, score ranges).
```
