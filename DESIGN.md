# KEEP & COURT — Master Design Document & Complete Playing Guide

> A fast, feel-good tableau-builder where you shop characters into a 3×3 castle,
> your combos **beat like a heartbeat** every round, and the whole court
> races for the same **Influence**. Shares DNA with the "shop-and-grid" family,
> but is its own game with its own rules, cards, and numbers.
>
> **Players:** 1–4 · **Age:** 10+ · **Length:** 30–40 min · **Original design.**

**Document status:** v1.0 — complete rules, full card roster, exact scoring, edge-cases, examples.
This document is written to be *implementable without ambiguity*. Every number here is canonical.

---

## TABLE OF CONTENTS

1. [Design Pillars & Philosophy](#1-design-pillars--philosophy)
2. [Components](#2-components)
3. [Core Concepts & Glossary](#3-core-concepts--glossary)
4. [Setup](#4-setup)
5. [The Game Round (Turn Structure)](#5-the-game-round-turn-structure)
6. [The Heartbeat (End-of-Round Pulse)](#6-the-heartbeat-end-of-round-pulse)
7. [Eras & The Influence Board](#7-eras--the-influence-board)
8. [Placement Rules (The 3×3 Grid)](#8-placement-rules-the-33-grid)
9. [Resolving Card Effects — Universal Rules](#9-resolving-card-effects--universal-rules)
10. [Scoring](#10-scoring)
11. [Keywords & Icon Dictionary](#11-keywords--icon-dictionary)
12. [THE FULL CARD ROSTER](#12-the-full-card-roster)
13. [Objective (Edict) Cards](#13-objective-edict-cards)
14. [Solo Mode](#14-solo-mode)
15. [Edge-Cases & FAQ (No Loose Ends)](#15-edge-cases--faq-no-loose-ends)
16. [Quick Reference Sheet](#16-quick-reference-sheet)
17. [Designer Notes & Balance Rationale](#17-designer-notes--balance-rationale)

---

## 1. DESIGN PILLARS & PHILOSOPHY

Keep & Court keeps the beloved shop-and-grid loop but fixes three weaknesses of the genre:

| Weakness in classic shop-and-grid games | Keep & Court's answer |
|---|---|
| Combos freeze once placed; payoff only at game end | **The Heartbeat** — combos re-trigger each round, so early placement compounds |
| Opponents barely interact (multiplayer solitaire) | **The Influence Board** — everyone races the same shared tracks |
| One "solved" optimal line kills replay | **Edicts & variable setup** — win conditions shift every game |

**Golden rule for designers/implementers:** when two rules seem to conflict, the more *specific* rule
(a card's printed text) always overrides the more *general* rule (this document's body). If still tied,
resolve in the acting player's favor and record the choice.

---

## 2. COMPONENTS

- **90 Character cards**, split into two decks:
  - **Keep deck (upper city / nobility):** 45 cards. Shields skew Azure, Violet, Verdant.
  - **Court deck (lower city / commons):** 45 cards. Shields skew Crimson, Amber, Gold.
- **18 Edict cards** (shared objectives; see §13).
- **1 Herald pawn** (the market selector).
- **1 Influence Board** with 6 tracks (one per shield color), each 0–12.
- **24 Influence markers** (6 per player, in 4 player colors).
- **Coins:** tokens of value 1 and 5 (supply is unlimited for practical purposes).
- **Keys:** 40 key tokens.
- **1 Era dial** (shows Era I / II / III).
- **4 Player screens** (optional; for hidden coin counts).
- **1 First-player marker** (the "Chamberlain").
- **This rulebook.**

---

## 3. CORE CONCEPTS & GLOSSARY

- **Tableau / Grid:** your personal 3×3 area. You will place exactly 9 cards over the game.
- **Market:** two rows of 3 face-up cards each — the **Keep row** (top) and the **Court row** (bottom).
- **Herald:** a pawn sitting beside one market row. You may normally only buy from the Herald's row.
- **Coin (🪙):** currency to buy cards. Coins are worthless at game end **unless stored in a Coffer** (see Purse/Coffer).
- **Key (🗝️):** flexible resource. Spend to manipulate the market; each **leftover key = 1 VP**.
- **Shield (🛡️):** every character shows **1 or 2 shields** of these six colors:
  - 🔵 **Azure** (nobility) · 🟣 **Violet** (faith) · 🟢 **Verdant** (scholarship)
  - 🔴 **Crimson** (military) · 🟠 **Amber** (craft) · 🟡 **Gold** (commons)
- **Coffer (👛):** a printed storage icon on some cards with a **capacity**. At game end you may move
  loose coins into Coffers (up to total capacity). Each coin in a Coffer = **1 VP**.
- **Heartbeat / Pulse:** the end-of-round step where cards marked with the **💓 Pulse** keyword re-trigger.
- **Influence:** your advancement on the shared 6-track board. Majorities score at the end of each Era.
- **Era:** the game is 9 rounds grouped into three Eras of 3 rounds each (I: r1–3, II: r4–6, III: r7–9).
- **VP (⭐):** victory points. Most come from end-game card scoring; some from Influence and Edicts.
- **Neighbor:** a card **orthogonally adjacent** (up/down/left/right) in your grid. Diagonals are **not** neighbors
  unless a card explicitly says "diagonal."
- **Row/Column:** a horizontal line of up to 3 cards / a vertical line of up to 3 cards in your 3×3.
- **Corner:** the four corner cells of the 3×3 (positions a1, a3, c1, c3 — see grid notation below).
- **Center:** the middle cell (b2).

**Grid notation (used throughout):** columns are **1,2,3** (left→right), rows are **a,b,c** (top→bottom).
So cells are a1 a2 a3 / b1 b2 b3 / c1 c2 c3. "a1" = top-left corner, "b2" = center.

---

## 4. SETUP

1. **Decks.** Shuffle the Keep deck and the Court deck separately. Place them face-down, Keep above Court.
2. **Market.** Deal **3 cards face-up** from each deck to form the Keep row (top) and Court row (bottom).
3. **Herald.** Place the Herald beside the **Court row** (commons go first).
4. **Influence Board.** Place it in the center. Each player places their 6 Influence markers at **0** on each of the 6 tracks.
5. **Edicts.** Shuffle Edicts; reveal **3** to the table (shared, face-up). Return the rest to the box.
   *(Short game variant: reveal 2. First game variant: use the 3 "starter" Edicts E1–E3.)*
6. **Starting resources.** Each player takes **12 coins** and **2 keys**.
   *(2-player: 12 coins / 2 keys. 3–4 player: 10 coins / 2 keys — scarcer economy keeps the race tight.)*
7. **First player.** The player who most recently entered a real castle (or random) takes the Chamberlain marker.
8. **Era dial** to **Era I**.

You are ready. The game lasts **9 rounds**; after round 9 every grid is full (3×3) and final scoring occurs.

---

## 5. THE GAME ROUND (TURN STRUCTURE)

A **round** = one turn for every player, in clockwise order starting from the Chamberlain.
After everyone has taken a turn, resolve the **Heartbeat** (§6), then (every third round) **Era scoring** (§7).

### A single player's turn, in strict order:

**Step 1 — (Optional) Manipulate the market.** You may spend **1 key** to do **one** of:
   - **(a) Move** the Herald to the other row, **or**
   - **(b) Refresh** the Herald's current row: discard all its cards face-down and deal 3 new from that deck.

   You may do this **at most once** per turn. (Design intent: keys are precious; each spent key is −1 potential VP.)

**Step 2 — Buy a card (mandatory).** You must take **one** card from the **Herald's row**:
   - Pay its **cost** (top-left number) in coins. Costs can be reduced by discounts but **never below 0**.
   - **If you cannot afford any card in the Herald's row** (after any Step-1 action), you must instead take
     **any one available market card** (either row) and place it **face-down** (a "Vagabond"). You immediately
     gain **+5 coins and +2 keys**. A face-down card has **no shields, no effect, no Pulse, and scores 0**,
     but it still occupies a grid cell and still counts as a "card" for adjacency-shape purposes
     (it is a blank wall).

**Step 3 — Place the card** into your grid (see §8). First card may go anywhere; later cards must be
   orthogonally adjacent to an existing card and keep the whole tableau within the 3×3 bounds.

**Step 4 — Raise Influence.** For **each shield** on the just-placed card (face-up only), advance your
   Influence marker on that color's track by **+1** (max 12). A 2-shield card raises two steps
   (two different colors, or +2 on one color if both shields share a color — see individual cards).

**Step 5 — Resolve the card's instant effect** (the ⚡ "On Hire" text), if any. See §9.

**Step 6 — Herald movement by card.** Some cards print "➡️ Keep" or "➡️ Court." If so, move the Herald
   to that row now. If a card prints nothing, the Herald stays.

**Step 7 — Refill.** Refill any market row with fewer than 3 cards, drawing from that row's own deck.
   If a deck is empty, shuffle its discard to form a new deck. If both a deck and its discard are empty,
   that row simply stays short (rare; only in long edge games).

Then play passes to the next player.

---

## 6. THE HEARTBEAT (END-OF-ROUND PULSE)

This is the signature mechanic. **After all players have finished their turn in a round**, resolve the Pulse:

- Each player, simultaneously, triggers every card in their grid that has the **💓 Pulse** keyword.
- A Pulse card produces its printed **per-round yield** (coins, keys, Influence, or VP tokens) based on the
  **current** state of the grid (neighbors, shields present, etc.).
- Pulses resolve **based on the grid as it stands right now** — so a Pulse card placed in round 2 will
  fire in rounds 2,3,4,5,6,7,8,9 = **8 times**; one placed in round 8 fires only in rounds 8,9 = twice.
  **Early engine cards compound; this is the central tempo tension of the game.**
- Pulse order within one player's grid: resolve **reading order a1→a2→a3→b1→…→c3**. This matters only when one
  Pulse card feeds another (rare, and always resolvable by reading order).
- **Face-down cards never Pulse.**

> **Why it matters (design):** classic grid games freeze combos at placement; here the grid is a living
> engine you tend each round. It rewards foresight ("buy the engine now, cheap and weak, or wait for the
> bomb?") and spreads the dopamine across the whole game instead of a single end-game avalanche.

---

## 7. ERAS & THE INFLUENCE BOARD

The 9 rounds are grouped into three Eras (I: r1–3, II: r4–6, III: r7–9).

**At the end of rounds 3, 6, and 9** (after that round's Heartbeat), score the Influence Board:

For **each of the 6 tracks**, award VP to the leaders on that track:
- **1st place (highest marker):** VP = **the Era number × 2** (so I→2, II→4, III→6).
- **2nd place:** VP = **the Era number × 1** (so I→1, II→2, III→3).
- **Ties for a place:** all tied players get the full VP for that place; the next place is **skipped**
  (standard "shared rank" rule). Example: two players tie for 1st in Era II → both get 4; no 2nd place awarded.
- A player with **0** on a track is never eligible to score that track.

**Important:** Influence markers do **NOT reset** between Eras. They keep climbing (max 12). This means
early Influence pays off repeatedly, but opponents can overtake you — a persistent, escalating race.

**Era-III scoring (round 9)** happens as part of final scoring (§10) and is worth the most (×6 / ×3).

> **Why it matters (design):** this is the interaction layer. You still build your own grid, but every
> shield you place nudges a shared race. It makes opponents' boards relevant without any "take-that" meanness,
> so the game stays feel-good and family-friendly while gaining real tension.

---

## 8. PLACEMENT RULES (THE 3×3 GRID)

- Your tableau is a **3×3** region. You will place exactly 9 cards (one per round).
- **First card:** place anywhere among the 9 cells (conceptually; in practice players build outward —
  the only hard constraint is the final shape must fit in 3×3).
- **Subsequent cards** must be placed **orthogonally adjacent** to at least one already-placed card.
- **The whole tableau may never exceed a 3×3 footprint.** Practically: track the bounding box of placed cards;
  it must always be ≤ 3 wide and ≤ 3 tall. (Implementation tip: fix the 3×3 once the bounding box reaches
  3 in a dimension; cells outside are illegal.)
- You may **never** rotate the grid or move a placed card (unless a card effect explicitly says so — none do
  in the base set; this is reserved for future expansions).
- Face-down (Vagabond) cards occupy a cell permanently and act as inert walls.

**Adjacency reminder:** neighbors are the up/down/left/right cells only. Corners (a1,a3,c1,c3) have 2 neighbors;
edges (a2,b1,b3,c2) have 3; center (b2) has 4.

---

## 9. RESOLVING CARD EFFECTS — UNIVERSAL RULES

Each card may have up to three timing bands, always printed in this order:

1. **⚡ On Hire** — resolves once, immediately, in turn Step 5.
2. **💓 Pulse** — resolves every Heartbeat (§6) while this card is face-up in your grid.
3. **⭐ End-game** — scored once during final scoring (§10).

Universal resolution rules:

- **"Gain"** adds to your supply. **"Pay/Lose"** removes (if you cannot pay the full amount, pay as much as possible;
  effects are never mandatory-to-your-ruin unless stated).
- **"Each neighbor…"** counts only orthogonal neighbors at the moment of resolution.
- **"A neighbor of your choice"** lets you pick one eligible orthogonal neighbor; if none eligible, the effect fizzles.
- **"Opponents"** means every other player. In solo, "opponents" refers to the Automa (§14).
- **Discounts** from a card apply to **future buys** only (never retroactively), and are printed as "−X cost to…".
- **Shield counting** always counts face-up shields in the specified region (your grid, a row, a column, etc.),
  including the card doing the counting unless it says "other."
- **Negative VP** is possible (some cards penalize). A player's final score can be lowered but combos rarely go
  below their investment.
- When an effect references the **Influence track**, "advance" = +1 step (max 12); it never exceeds 12.

**Resolution timing conflicts:** On Hire (Step 5) < Herald move (Step 6) < Refill (Step 7) < Heartbeat (end of round)
< Era scoring (every 3rd round) < Final scoring (after round 9). Resolve strictly in that order.

---

## 10. SCORING

Final scoring, after round 9's Heartbeat and Era-III Influence scoring, in this order:

1. **Coffers.** You may move your loose coins into your Coffers (any distribution up to each Coffer's capacity).
   Each coin inside a Coffer = **1 VP**. Loose coins NOT in a Coffer = **0 VP**.
2. **End-game card scoring (⭐).** Resolve every face-up card's ⭐ clause. Face-down cards = 0.
   Resolve all simultaneously using the final grid state (they do not chain unless a card says so).
3. **Keys.** Each leftover key = **1 VP**.
4. **Era-III Influence** (×6 / ×3) is scored here as part of the final tally (see §7).
5. **Edicts.** Score the 3 shared Edict cards (§13).

**Winner:** most total VP. **Tie-breakers, in order:** (1) most leftover keys; (2) most coins in Coffers;
(3) most face-up cards (fewest Vagabonds); (4) highest single Influence track; (5) shared victory.

A healthy competitive score is roughly **90–110 VP**; averaging **~10 VP per card plus Influence** is strong.

---

## 11. KEYWORDS & ICON DICTIONARY

| Icon / Keyword | Meaning |
|---|---|
| 🪙 Coin | Currency; 0 VP unless in a Coffer |
| 🗝️ Key | Market manipulation; 1 VP each at end |
| 🛡️ Shield | A card's color identity; raises Influence when placed |
| ⚡ On Hire | One-time instant effect at placement |
| 💓 Pulse | Re-triggers every Heartbeat (end of each round) |
| ⭐ End-game | Scored once in final scoring |
| 👛 Coffer (N) | Coin storage of capacity N; each stored coin = 1 VP |
| ➡️ Keep / ➡️ Court | Move Herald to that row after placing |
| −X cost | Discount applied to your future buys |
| Neighbor | Orthogonally adjacent card |
| Set | A group of same-color shields you specify |
| Vagabond | A face-down card (inert wall, 0 everything) |

**Color shorthand used in the roster:** Az=Azure🔵, Vi=Violet🟣, Ve=Verdant🟢, Cr=Crimson🔴, Am=Amber🟠, Go=Gold🟡.

---

## 12. THE FULL CARD ROSTER

Format for each card:
`#ID — Name · Cost · Shields · [Deck] | ⚡On Hire | 💓Pulse | ⭐End-game`

Costs and numbers below are the canonical tuned values. The roster is designed so that cheap cards give
economy/engine, mid cards give combos, and expensive cards give big end-game payoffs — mirroring a healthy
shop curve. **Keep deck = 45 cards (K01–K45). Court deck = 45 cards (C01–C45). Total 90.**

### 12.1 KEEP DECK (Nobility — skews Azure / Violet / Verdant)

**— Economy & Engine (cheap) —**

- **K01 — Chamber Clerk · 1 · Ve · ** | ⚡ Gain 2🪙. | 💓 Gain 1🪙. | ⭐ —
- **K02 — Novice Monk · 1 · Vi · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 2⭐ if orthogonally adjacent to another Violet.
- **K03 — Herald's Page · 1 · Az · ** | ⚡ Gain 1🪙, then you MAY move the Herald. | 💓 — | ⭐ 1⭐ per Azure in its row (incl. itself).
- **K04 — Court Scribe · 2 · Ve · ** | ⚡ — | 💓 Gain 1🪙 for each Verdant neighbor. | ⭐ —
- **K05 — Almoner · 2 · Vi · ** | ⚡ Gain 2🪙 and 1🗝️. | 💓 — | ⭐ 1⭐ per key you hold at game end (max 6).
- **K06 — Steward · 2 · Az · 👛(4)** | ⚡ — | 💓 — | ⭐ Coffer(4): up to 4 coins stored = 4⭐.
- **K07 — Lamplighter · 2 · Ve · ** | ⚡ — | 💓 Gain 1🪙 if this card is on an edge cell (not corner, not center). | ⭐ —
- **K08 — Beekeeper of the Keep · 3 · Vi · 👛(6)** | ⚡ Gain 2🪙. | 💓 — | ⭐ Coffer(6).

**— Shield / Set scorers (mid) —**

- **K09 — Cartographer · 3 · Ve · ** | ⚡ — | 💓 — | ⭐ 2⭐ per Verdant in its column.
- **K10 — Bishop · 4 · Vi,Vi · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 3⭐ per other Violet orthogonally adjacent.
- **K11 — Royal Astronomer · 4 · Ve · ** | ⚡ −1 cost to your next buy. | 💓 — | ⭐ 2⭐ per different shield color in its row.
- **K12 — Herald Marshal · 3 · Az · ** | ⚡ Move the Herald; gain 1🗝️. | 💓 — | ⭐ 1⭐ per Azure in your whole grid.
- **K13 — Choirmaster · 4 · Vi · ** | ⚡ — | 💓 Advance your Violet Influence +1. | ⭐ 4⭐ if you are 1st or tied-1st on the Violet track.
- **K14 — Falconer · 3 · Az · ** | ⚡ — | 💓 Gain 1🪙 per Azure neighbor. | ⭐ —
- **K15 — Librarian · 5 · Ve,Ve · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 2⭐ per Verdant in your grid (incl. itself).
- **K16 — Confessor · 4 · Vi · ** | ⚡ Look at a neighbor; if Crimson, gain 3🪙. | 💓 — | ⭐ 2⭐ per Violet neighbor.
- **K17 — Keep Treasurer · 5 · Az · 👛(8)** | ⚡ — | 💓 — | ⭐ Coffer(8).
- **K18 — Illuminator · 4 · Ve · ** | ⚡ Gain 2🪙. | 💓 — | ⭐ 3⭐ if in the center cell (b2).

**— Position scorers (mid) —**

- **K19 — Gatekeeper · 3 · Az · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 3⭐ if in a corner cell.
- **K20 — Spire Watch · 4 · Ve · ** | ⚡ — | 💓 Advance any one Influence +1. | ⭐ 2⭐ per card in its row.
- **K21 — Chancellor · 5 · Az,Az · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 2⭐ per Azure in its row and column (count the cross; the Chancellor counts once).
- **K22 — Vault Keeper · 5 · Vi · 👛(10)** | ⚡ — | 💓 — | ⭐ Coffer(10).

**— Engines (mid-high) —**

- **K23 — Alchemist · 5 · Ve · ** | ⚡ Gain 3🪙. | 💓 Gain 1🪙 and advance Verdant +1. | ⭐ —
- **K24 — Mint Master · 6 · Az · ** | ⚡ — | 💓 Gain 2🪙. | ⭐ 1⭐ per 3 coins you hold at game end (round down).
- **K25 — Prior · 5 · Vi · ** | ⚡ Gain 1🗝️. | 💓 Gain 1🗝️ if you have fewer than 3 keys. | ⭐ 1⭐ per key (max 8).
- **K26 — Seneschal · 6 · Az · ** | ⚡ — | 💓 Advance Azure +1; gain 1🪙. | ⭐ 3⭐ if 1st on Azure track.
- **K27 — Grand Vizier · 6 · Ve,Az · ** | ⚡ Gain 2🪙, 1🗝️. | 💓 — | ⭐ 2⭐ per different shield color in your grid.

**— Big end-game payoffs (expensive) —**

- **K28 — Her Majesty the Queen · 8 · Az · ** | ⚡ — | 💓 — | ⭐ 2⭐ per Azure, Verdant, and Amber neighbor (count each such neighbor).
- **K29 — The Cathedral · 8 · Vi,Vi · ** | ⚡ — | 💓 — | ⭐ 3⭐ per Violet in your grid (incl. itself).
- **K30 — Royal Treasury · 7 · Az · 👛(14)** | ⚡ — | 💓 — | ⭐ Coffer(14).
- **K31 — The Archive · 7 · Ve,Ve · ** | ⚡ — | 💓 — | ⭐ 4⭐ per column that contains at least one Verdant.
- **K32 — Lord Chamberlain · 8 · Az,Vi · ** | ⚡ Gain 3🪙. | 💓 — | ⭐ 1⭐ per Influence 1st-place you hold at game end × 3.

**— Interaction & tempo (mixed cost) —**

- **K33 — Spymaster · 4 · Az · ** | ⚡ Each opponent loses 1🗝️ (if able). | 💓 — | ⭐ 2⭐ if no neighbor shares a color with it.
- **K34 — Tax Collector · 5 · Az · ** | ⚡ Each opponent pays you 1🪙 (if able). | 💓 — | ⭐ —
- **K35 — Diplomat · 4 · Ve · ** | ⚡ Advance any two different Influence tracks +1 each. | 💓 — | ⭐ 2⭐ per track you are 1st/tied-1st on.
- **K36 — Inquisitor · 5 · Vi · ** | ⚡ Choose a color; each opponent with 0 of that color in their grid gives you 2🪙. | 💓 — | ⭐ 2⭐ per Violet neighbor.

**— Flexible / wild (mid-high) —**

- **K37 — The Regent · 7 · Az,Az · ** | ⚡ Gain 1🗝️. | 💓 Advance Azure +1. | ⭐ 2⭐ per Azure in grid; −2⭐ per Gold in grid.
- **K38 — Pilgrim · 3 · Vi · ** | ⚡ −2 cost to your next buy. | 💓 — | ⭐ 2⭐ if adjacent to the center.
- **K39 — Court Painter · 4 · Ve · ** | ⚡ Gain 1🪙 per different color currently in the market. | 💓 — | ⭐ 1⭐ per different color in your grid.
- **K40 — Herald of Dawn · 2 · Az · ** | ⚡ Move Herald; gain 1🪙. ➡️ Court | 💓 — | ⭐ 2⭐ if in top row (row a).
- **K41 — Reliquary · 6 · Vi · 👛(6)** | ⚡ Gain 1🗝️. | 💓 — | ⭐ Coffer(6) + 1⭐ per Violet neighbor.
- **K42 — The Observatory · 6 · Ve,Ve · ** | ⚡ — | 💓 Advance Verdant +1; gain 1🪙. | ⭐ 3⭐ if top-right corner (a3).
- **K43 — Lady of the Keep · 7 · Az · ** | ⚡ Gain 2🪙, 1🗝️. | 💓 — | ⭐ 3⭐ per Azure in its row.
- **K44 — The Grand Hall · 8 · Az,Ve · ** | ⚡ — | 💓 Gain 1🪙 per neighbor. | ⭐ 2⭐ per neighbor.
- **K45 — The Oracle · 6 · Ve · ** | ⚡ Draw-peek: look at the top card of each deck; you may discard one. | 💓 Advance any Influence +1. | ⭐ 2⭐ per Verdant in column.

### 12.2 COURT DECK (Commons — skews Crimson / Amber / Gold)

**— Economy & Engine (cheap) —**

- **C01 — Farmhand · 1 · Go · ** | ⚡ Gain 2🪙. | 💓 Gain 1🪙. | ⭐ —
- **C02 — Blacksmith's Boy · 1 · Cr · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 2⭐ if adjacent to another Crimson.
- **C03 — Market Crier · 1 · Am · ** | ⚡ Gain 1🪙; you MAY move the Herald. | 💓 — | ⭐ 1⭐ per Amber in its row.
- **C04 — Miller · 2 · Go · ** | ⚡ — | 💓 Gain 1🪙 per Gold neighbor. | ⭐ —
- **C05 — Tanner · 2 · Am · ** | ⚡ Gain 2🪙, 1🗝️. | 💓 — | ⭐ 1⭐ per key held (max 6).
- **C06 — Granary · 2 · Go · 👛(4)** | ⚡ — | 💓 — | ⭐ Coffer(4).
- **C07 — Ratcatcher · 2 · Cr · ** | ⚡ — | 💓 Gain 1🪙 if on an edge cell. | ⭐ —
- **C08 — Village Beekeeper · 3 · Go · 👛(6)** | ⚡ Gain 2🪙. | 💓 — | ⭐ Coffer(6).

**— Shield / Set scorers (mid) —**

- **C09 — Surveyor · 3 · Am · ** | ⚡ — | 💓 — | ⭐ 2⭐ per Amber in its column.
- **C10 — Captain · 4 · Cr,Cr · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 3⭐ per other Crimson orthogonally adjacent.
- **C11 — Wheelwright · 4 · Am · ** | ⚡ −1 cost to your next buy. | 💓 — | ⭐ 2⭐ per different shield color in its row.
- **C12 — Town Herald · 3 · Go · ** | ⚡ Move the Herald; gain 1🗝️. | 💓 — | ⭐ 1⭐ per Gold in your whole grid.
- **C13 — Drill Sergeant · 4 · Cr · ** | ⚡ — | 💓 Advance your Crimson Influence +1. | ⭐ 4⭐ if 1st/tied-1st on Crimson track.
- **C14 — Houndmaster · 3 · Cr · ** | ⚡ — | 💓 Gain 1🪙 per Crimson neighbor. | ⭐ —
- **C15 — Guild Archive · 5 · Am,Am · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 2⭐ per Amber in your grid (incl. itself).
- **C16 — Innkeeper · 4 · Go · ** | ⚡ Look at a neighbor; if Violet, gain 3🪙. | 💓 — | ⭐ 2⭐ per Gold neighbor.
- **C17 — Guild Treasurer · 5 · Am · 👛(8)** | ⚡ — | 💓 — | ⭐ Coffer(8).
- **C18 — Festival Fool · 4 · Go · ** | ⚡ Gain 2🪙. | 💓 — | ⭐ 3⭐ if in the center cell (b2).

**— Position scorers (mid) —**

- **C19 — Watchman · 3 · Cr · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 3⭐ if in a corner cell.
- **C20 — Town Square · 4 · Am · ** | ⚡ — | 💓 Advance any one Influence +1. | ⭐ 2⭐ per card in its row.
- **C21 — General · 5 · Cr,Cr · ** | ⚡ Gain 1🗝️. | 💓 — | ⭐ 2⭐ per Crimson in its row and column (the cross; counts once).
- **C22 — Strongbox · 5 · Go · 👛(10)** | ⚡ — | 💓 — | ⭐ Coffer(10).

**— Engines (mid-high) —**

- **C23 — Brewer · 5 · Am · ** | ⚡ Gain 3🪙. | 💓 Gain 1🪙 and advance Amber +1. | ⭐ —
- **C24 — Moneylender · 6 · Go · ** | ⚡ — | 💓 Gain 2🪙. | ⭐ 1⭐ per 3 coins held at end (round down).
- **C25 — Quartermaster · 5 · Cr · ** | ⚡ Gain 1🗝️. | 💓 Gain 1🗝️ if you have fewer than 3 keys. | ⭐ 1⭐ per key (max 8).
- **C26 — Guildmaster · 6 · Am · ** | ⚡ — | 💓 Advance Amber +1; gain 1🪙. | ⭐ 3⭐ if 1st on Amber track.
- **C27 — Master of Arms · 6 · Cr,Am · ** | ⚡ Gain 2🪙, 1🗝️. | 💓 — | ⭐ 2⭐ per different shield color in your grid.

**— Big end-game payoffs (expensive) —**

- **C28 — The Baroness · 8 · Go · ** | ⚡ — | 💓 — | ⭐ 2⭐ per Gold, Crimson, and Amber neighbor.
- **C29 — The Great Market · 8 · Am,Am · ** | ⚡ — | 💓 — | ⭐ 3⭐ per Amber in your grid (incl. itself).
- **C30 — Grand Vault · 7 · Go · 👛(14)** | ⚡ — | 💓 — | ⭐ Coffer(14).
- **C31 — The Barracks · 7 · Cr,Cr · ** | ⚡ — | 💓 — | ⭐ 4⭐ per row that contains at least one Crimson.
- **C32 — Lord Mayor · 8 · Go,Am · ** | ⚡ Gain 3🪙. | 💓 — | ⭐ 3⭐ per Influence 1st-place you hold at game end.

**— Interaction & tempo (mixed cost) —**

- **C33 — Smuggler · 4 · Am · ** | ⚡ Each opponent loses 1🪙 (if able); you gain that many 🪙. | 💓 — | ⭐ 2⭐ if no neighbor shares a color.
- **C34 — Mercenary · 5 · Cr · ** | ⚡ Each opponent pays you 1🪙 (if able). | 💓 — | ⭐ 2⭐ per Crimson neighbor.
- **C35 — Envoy · 4 · Am · ** | ⚡ Advance any two different Influence tracks +1 each. | 💓 — | ⭐ 2⭐ per track you are 1st/tied-1st on.
- **C36 — Agitator · 5 · Cr · ** | ⚡ Choose a color; each opponent with 0 of that color gives you 2🪙. | 💓 — | ⭐ 2⭐ per Crimson neighbor.

**— Flexible / wild (mid-high) —**

- **C37 — The Warlord · 7 · Cr,Cr · ** | ⚡ Gain 1🗝️. | 💓 Advance Crimson +1. | ⭐ 2⭐ per Crimson in grid; −2⭐ per Azure in grid.
- **C38 — Wanderer · 3 · Go · ** | ⚡ −2 cost to your next buy. | 💓 — | ⭐ 2⭐ if adjacent to the center.
- **C39 — Street Artist · 4 · Am · ** | ⚡ Gain 1🪙 per different color in the market. | 💓 — | ⭐ 1⭐ per different color in your grid.
- **C40 — Dawn Peddler · 2 · Go · ** | ⚡ Move Herald; gain 1🪙. ➡️ Keep | 💓 — | ⭐ 2⭐ if in bottom row (row c).
- **C41 — Shrine · 6 · Am · 👛(6)** | ⚡ Gain 1🗝️. | 💓 — | ⭐ Coffer(6) + 1⭐ per Amber neighbor.
- **C42 — The Arena · 6 · Cr,Cr · ** | ⚡ — | 💓 Advance Crimson +1; gain 1🪙. | ⭐ 3⭐ if bottom-left corner (c1).
- **C43 — The Baron · 7 · Go · ** | ⚡ Gain 2🪙, 1🗝️. | 💓 — | ⭐ 3⭐ per Gold in its row.
- **C44 — The Fairgrounds · 8 · Go,Am · ** | ⚡ — | 💓 Gain 1🪙 per neighbor. | ⭐ 2⭐ per neighbor.
- **C45 — The Seer · 6 · Am · ** | ⚡ Peek top of each deck; you may discard one. | 💓 Advance any Influence +1. | ⭐ 2⭐ per Amber in column.

---

## 13. OBJECTIVE (EDICT) CARDS

Reveal **3** at setup. Each is scored once at game end (§10). Edicts use only the game's native vocabulary
(shields, rows/columns/corners/center, neighbors, coffers, keys, Influence). All players compete for all 3.

**Starter set (recommended for first game): E1, E2, E3.**

- **E1 — Royal Symmetry:** +6⭐ if every column contains at least one Azure OR every column contains at least one Gold.
- **E2 — The Full Keep:** +5⭐ if you have **zero** face-down (Vagabond) cards; otherwise +0.
- **E3 — Diverse Court:** +2⭐ per different shield color present in your grid (max 6 colors → 12⭐).
- **E4 — Corner Lords:** +3⭐ per corner cell holding a 2-shield card.
- **E5 — Central Power:** +8⭐ if the center cell (b2) shares a color with all four of its neighbors.
- **E6 — Keymaster:** +1⭐ per key you hold at end, doubled (so 2⭐/key), max 16.
- **E7 — The Hoard:** +1⭐ per 2 coins stored in Coffers (round down), max 15.
- **E8 — Monochrome Row:** +7⭐ if any one row is entirely a single shield color (count 2-shield cards by any one of their colors).
- **E9 — Rainbow Column:** +7⭐ if any one column shows three different colors across its three cards.
- **E10 — Influence Baron:** +4⭐ per Influence track you finish 1st or tied-1st on.
- **E11 — Balanced Realm:** +10⭐ if your grid has at least one shield of **four or more** different colors AND no color appears more than 3 times.
- **E12 — The Fortress:** +2⭐ per edge cell (a2,b1,b3,c2) holding a Crimson shield.
- **E13 — Faithful Court:** +2⭐ per Violet in your grid; −1⭐ per Crimson in your grid.
- **E14 — Warmongers:** +2⭐ per Crimson in your grid; −1⭐ per Violet in your grid.
- **E15 — The Great Chain:** +3⭐ per orthogonal pair of same-colored neighbors (count each adjacent same-color edge once).
- **E16 — Merchant Prince:** +12⭐ if you end with 0 loose coins (all coins either spent or in Coffers) AND ≥1 Coffer card.
- **E17 — The Spire:** +6⭐ if your top row (row a) has a higher total shield count than your bottom row (row c).
- **E18 — Pilgrim's Path:** +2⭐ per Violet that is orthogonally adjacent to a Verdant (count each qualifying Violet once).

---

## 14. SOLO MODE ("Against the Steward")

Play all 9 rounds normally. An **Automa "Steward"** competes for Influence and Edicts.

- The Steward does not build a grid. Instead, after each player turn, the Steward **advances Influence**:
  flip the top Keep or Court deck card (alternate decks each round; Keep first) and advance the Steward's
  marker **+1 on each shield color shown** (max 12). Discard that card.
- The Steward "holds" **no keys/coins** and never buys.
- At Era scoring, the Steward competes for Influence majorities exactly like a player (its markers count).
- At game end, the Steward scores Edicts it can satisfy via its Influence standing (E10, E_Influence-type) only;
  it scores **0** for grid-based Edicts.
- **Difficulty dial:** Easy = Steward advances 1 color per flip (the lowest shown). Normal = all shown.
  Hard = all shown **+1 extra** on the color the Steward is currently leading.
- **You win** if your total VP beats the Steward's Influence+Edict VP. Target: beat it by 20+ for "Mastery."

---

## 15. EDGE-CASES & FAQ (NO LOOSE ENDS)

**Q. Both market rows are unaffordable and I have no key — what happens?**
A. Step 2's fallback triggers: take any one market card face-down (Vagabond), gain +5🪙 +2🗝️.

**Q. Can I choose to go face-down (Vagabond) even if I can afford a card?**
A. No. Vagabond is only the forced fallback when you truly cannot afford **any** card in the Herald's row
(after your optional Step-1 action). This prevents coin-farming abuse.

**Q. A deck runs out mid-game.**
A. Shuffle that deck's discard pile to form a new deck. If both deck and discard are empty, that row stays short.
Buying is still mandatory from whatever is present; if the Herald's row is completely empty, you may buy from the
other row this turn for free movement (treat as if the Herald were there), else take the face-down fallback.

**Q. A Pulse card is placed on the last round (round 9). Does it Pulse?**
A. Yes, once — the round-9 Heartbeat still happens before final scoring. (Placed r9 → fires 1×.)

**Q. Do face-down Vagabond cards block Influence or Pulses?**
A. They have no shields (no Influence), never Pulse, and score 0. They DO occupy a cell and count as a
"card/neighbor" for shape and for effects that count "cards in a row" (they are a card) but NOT for anything
counting shields or colors (they have none).

**Q. "2⭐ per card in its row" — does a Vagabond count?**
A. Yes; it's a card. Effects counting *shields/colors* ignore it; effects counting *cards* include it.

**Q. Can Influence exceed 12?**
A. No. 12 is the cap; extra advances are lost.

**Q. Two Pulse cards each say "gain 1🪙 per X neighbor" and are neighbors of each other.**
A. Each resolves independently using the final grid; neighbor relationships don't change mid-Heartbeat.
Resolve in reading order a1→c3; the result is the same regardless since they only read static shields.

**Q. On-Hire effect that targets "a neighbor" when the card is placed with no neighbors (first card).**
A. The effect fizzles (no legal target). You still placed the card and raised Influence.

**Q. Can a discount reduce a cost below 0 (gaining coins)?**
A. Never. Minimum effective cost is 0.

**Q. Negative VP from cards like The Regent/The Warlord — can my score go below 0?**
A. Mathematically yes, but in practice the shields raising Influence and keys floor you well above 0.
No special rule; just sum everything, including negatives.

**Q. Ties in Influence majority.**
A. Shared rank: all tied players get the full VP of that place; the next place is skipped (§7).

**Q. Do Edicts interact with each other?**
A. No. Each Edict is scored independently against your final grid/resources.

**Q. If a card says "➡️ Court" but the Herald is already at Court?**
A. It stays at Court (no effect). Herald-move effects are "set to this row," not "toggle."

**Q. Multiple Coffers — how do I assign coins?**
A. At end, distribute loose coins into any of your Coffers in any split, up to each Coffer's capacity.
Each stored coin = 1 VP; unstored coins = 0.

**Q. Can I place a card to intentionally make a smaller-than-3×3 final shape?**
A. No. You place exactly 9 cards over 9 rounds; the final tableau is always a full 3×3.

**Q. "−2 cost to your next buy" but I don't buy anything costly next turn.**
A. The discount applies to your very next buy only (this or a later turn? → **your next buy**, which is next
turn's mandatory buy). It does not stack or persist beyond that one buy. Unused discount is lost.

**Q. Order of simultaneous end-game scoring.**
A. All ⭐ clauses read the final frozen grid simultaneously; they never feed each other unless a card says so
(none do in the base set). Compute independently and sum.

---

## 16. QUICK REFERENCE SHEET

**Turn:** (1) *maybe* spend 1🗝️ → move Herald **or** refresh its row · (2) buy a card from Herald's row
(or face-down fallback: +5🪙+2🗝️) · (3) place in 3×3 adjacent · (4) raise Influence per shield ·
(5) resolve ⚡ · (6) card may move Herald · (7) refill rows.

**End of each round:** 💓 Heartbeat — every Pulse card fires.

**End of rounds 3/6/9:** Influence scoring. 1st = Era×2 VP, 2nd = Era×1 VP, per track. Markers never reset.

**Game end (after r9):** fill Coffers → score ⭐ cards → +1 VP/key → Era-III Influence → score 3 Edicts.

**Tie-break:** keys → coffer coins → fewest Vagabonds → highest single track → shared.

**Shield skew:** Keep deck → 🔵🟣🟢 · Court deck → 🔴🟠🟡. Refresh wisely to fish colors.

---

## 17. DESIGNER NOTES & BALANCE RATIONALE

- **Why the Heartbeat caps the game at 9 rounds, not more:** 8 maximum pulses from a round-2 engine keeps
  numbers bounded; a round-1 engine is impossible since every player's first card lands in round 1 but the
  first Heartbeat already fires that round — so max pulses = 9 (place r1, fires r1–9). Big Pulse yields are
  therefore kept to 1–2 per round to avoid runaway (e.g., Mint Master/Moneylender give 2🪙, not VP).
- **Why Influence doesn't reset:** a resetting race makes early Eras feel pointless; a cumulative race makes
  every shield placement matter all game and creates comeback tension (×6 Era III can swing the result).
- **Why coins are near-worthless without Coffers:** preserves the classic "spend it or lose it" economic
  tension while giving Coffer-engine builds (Beekeeper/Treasury/Vault) a real identity.
- **Color skew between decks** is the fishing lever: refreshing the Keep row hunts 🔵🟣🟢; the Court row hunts
  🔴🟠🟡. This makes the optional key-spend meaningful and gives the Herald real strategic weight.
- **Interaction cards (Spymaster, Tax Collector, Smuggler, Mercenary, Agitator, Inquisitor)** are intentionally
  mild — they tax resources, never destroy board state, keeping the game feel-good.
- **Target scores:** ~90–110 VP competitive. If a card consistently pushes solo scores far past this in
  playtesting, trim its multiplier by 1 (e.g., Cathedral/Great Market from 3⭐ to 2⭐).
- **Expansion hooks (not in base):** movable cards ("Steward reposition"), delayed effects ("Padlock"),
  faction allegiance bonuses — all compatible with this engine without touching the core loop.

---

*End of Keep & Court v1.0 master document. Every rule, card, and number above is canonical and
implementation-ready. For a playable build, this document is the single source of truth.*
