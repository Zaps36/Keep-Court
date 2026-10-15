// ============================================================================
// Keep & Court — Full Card Roster (90 cards) + Edicts (18)
// Transcribed from DESIGN.md v1.0. Every number here is canonical.
// Effect logic is implemented in effects.ts, keyed by the strings below.
// ============================================================================

import type { CardDef, EdictDef } from './types'

// ---------------------------------------------------------------------------
// KEEP DECK (Nobility — skews Az / Vi / Ve) — 45 cards K01..K45
// ---------------------------------------------------------------------------
export const KEEP_CARDS: CardDef[] = [
  // Economy & Engine (cheap)
  { id: 'K01', name: 'Chamber Clerk', cost: 1, shields: ['Ve'], deck: 'Keep', onHire: 'gainCoins:2', pulse: 'gainCoins:1', text: { onHire: 'Gain 2🪙.', pulse: 'Gain 1🪙.' } },
  { id: 'K02', name: 'Novice Monk', cost: 1, shields: ['Vi'], deck: 'Keep', onHire: 'gainKeys:1', endgame: 'vpIfAdjColor:Vi:2', text: { onHire: 'Gain 1🗝️.', endgame: '2⭐ if adjacent to another Violet.' } },
  { id: 'K03', name: "Herald's Page", cost: 1, shields: ['Az'], deck: 'Keep', onHire: 'gainCoins:1|mayMoveHerald', endgame: 'vpPerColorInRow:Az:1', text: { onHire: 'Gain 1🪙; may move Herald.', endgame: '1⭐ per Azure in its row.' } },
  { id: 'K04', name: 'Court Scribe', cost: 2, shields: ['Ve'], deck: 'Keep', pulse: 'coinsPerNeighborColor:Ve:1', text: { pulse: 'Gain 1🪙 per Verdant neighbor.' } },
  { id: 'K05', name: 'Almoner', cost: 2, shields: ['Vi'], deck: 'Keep', onHire: 'gainCoins:2|gainKeys:1', endgame: 'vpPerKeyHeld:1:6', text: { onHire: 'Gain 2🪙, 1🗝️.', endgame: '1⭐ per key (max 6).' } },
  { id: 'K06', name: 'Steward', cost: 2, shields: ['Az'], deck: 'Keep', cofferCapacity: 4, endgame: 'coffer', text: { endgame: 'Coffer(4).' } },
  { id: 'K07', name: 'Lamplighter', cost: 2, shields: ['Ve'], deck: 'Keep', pulse: 'coinsIfEdge:1', text: { pulse: 'Gain 1🪙 if on an edge cell.' } },
  { id: 'K08', name: 'Beekeeper of the Keep', cost: 3, shields: ['Vi'], deck: 'Keep', cofferCapacity: 6, onHire: 'gainCoins:2', endgame: 'coffer', text: { onHire: 'Gain 2🪙.', endgame: 'Coffer(6).' } },
  // Shield / Set scorers (mid)
  { id: 'K09', name: 'Cartographer', cost: 3, shields: ['Ve'], deck: 'Keep', endgame: 'vpPerColorInColumn:Ve:2', text: { endgame: '2⭐ per Verdant in its column.' } },
  { id: 'K10', name: 'Bishop', cost: 4, shields: ['Vi', 'Vi'], deck: 'Keep', onHire: 'gainKeys:1', endgame: 'vpPerOtherAdjColor:Vi:3', text: { onHire: 'Gain 1🗝️.', endgame: '3⭐ per other adjacent Violet.' } },
  { id: 'K11', name: 'Royal Astronomer', cost: 4, shields: ['Ve'], deck: 'Keep', onHire: 'discountNext:1', endgame: 'vpPerColorsInRow:2', text: { onHire: '−1 cost to next buy.', endgame: '2⭐ per different color in its row.' } },
  { id: 'K12', name: 'Herald Marshal', cost: 3, shields: ['Az'], deck: 'Keep', onHire: 'mayMoveHerald|gainKeys:1', endgame: 'vpPerColorInGrid:Az:1', text: { onHire: 'Move Herald; gain 1🗝️.', endgame: '1⭐ per Azure in grid.' } },
  { id: 'K13', name: 'Choirmaster', cost: 4, shields: ['Vi'], deck: 'Keep', pulse: 'advInfluence:Vi', endgame: 'vpIfLeaderTrack:Vi:4', text: { pulse: 'Advance Violet +1.', endgame: '4⭐ if 1st on Violet.' } },
  { id: 'K14', name: 'Falconer', cost: 3, shields: ['Az'], deck: 'Keep', pulse: 'coinsPerNeighborColor:Az:1', text: { pulse: 'Gain 1🪙 per Azure neighbor.' } },
  { id: 'K15', name: 'Librarian', cost: 5, shields: ['Ve', 'Ve'], deck: 'Keep', onHire: 'gainKeys:1', endgame: 'vpPerColorInGrid:Ve:2', text: { onHire: 'Gain 1🗝️.', endgame: '2⭐ per Verdant in grid.' } },
  { id: 'K16', name: 'Confessor', cost: 4, shields: ['Vi'], deck: 'Keep', onHire: 'coinsIfNeighborColor:Cr:3', endgame: 'vpPerNeighborColor:Vi:2', text: { onHire: 'If a neighbor is Crimson, gain 3🪙.', endgame: '2⭐ per Violet neighbor.' } },
  { id: 'K17', name: 'Keep Treasurer', cost: 5, shields: ['Az'], deck: 'Keep', cofferCapacity: 8, endgame: 'coffer', text: { endgame: 'Coffer(8).' } },
  { id: 'K18', name: 'Illuminator', cost: 4, shields: ['Ve'], deck: 'Keep', onHire: 'gainCoins:2', endgame: 'vpIfCenter:3', text: { onHire: 'Gain 2🪙.', endgame: '3⭐ if in center.' } },
  // Position scorers (mid)
  { id: 'K19', name: 'Gatekeeper', cost: 3, shields: ['Az'], deck: 'Keep', onHire: 'gainKeys:1', endgame: 'vpIfCorner:3', text: { onHire: 'Gain 1🗝️.', endgame: '3⭐ if in a corner.' } },
  { id: 'K20', name: 'Spire Watch', cost: 4, shields: ['Ve'], deck: 'Keep', pulse: 'advInfluenceAny', endgame: 'vpPerCardInRow:2', text: { pulse: 'Advance any Influence +1.', endgame: '2⭐ per card in its row.' } },
  { id: 'K21', name: 'Chancellor', cost: 5, shields: ['Az', 'Az'], deck: 'Keep', onHire: 'gainKeys:1', endgame: 'vpPerColorInCross:Az:2', text: { onHire: 'Gain 1🗝️.', endgame: '2⭐ per Azure in its row+column.' } },
  { id: 'K22', name: 'Vault Keeper', cost: 5, shields: ['Vi'], deck: 'Keep', cofferCapacity: 10, endgame: 'coffer', text: { endgame: 'Coffer(10).' } },
  // Engines (mid-high)
  { id: 'K23', name: 'Alchemist', cost: 5, shields: ['Ve'], deck: 'Keep', onHire: 'gainCoins:3', pulse: 'gainCoins:1|advInfluence:Ve', text: { onHire: 'Gain 3🪙.', pulse: 'Gain 1🪙; advance Verdant +1.' } },
  { id: 'K24', name: 'Mint Master', cost: 6, shields: ['Az'], deck: 'Keep', pulse: 'gainCoins:2', endgame: 'vpPerCoins:3:1', text: { pulse: 'Gain 2🪙.', endgame: '1⭐ per 3 coins held.' } },
  { id: 'K25', name: 'Prior', cost: 5, shields: ['Vi'], deck: 'Keep', onHire: 'gainKeys:1', pulse: 'gainKeyIfFew:3', endgame: 'vpPerKeyHeld:1:8', text: { onHire: 'Gain 1🗝️.', pulse: 'Gain 1🗝️ if fewer than 3 keys.', endgame: '1⭐ per key (max 8).' } },
  { id: 'K26', name: 'Seneschal', cost: 6, shields: ['Az'], deck: 'Keep', pulse: 'advInfluence:Az|gainCoins:1', endgame: 'vpIfLeaderTrack:Az:3', text: { pulse: 'Advance Azure +1; gain 1🪙.', endgame: '3⭐ if 1st on Azure.' } },
  { id: 'K27', name: 'Grand Vizier', cost: 6, shields: ['Ve', 'Az'], deck: 'Keep', onHire: 'gainCoins:2|gainKeys:1', endgame: 'vpPerColorsInGrid:2', text: { onHire: 'Gain 2🪙, 1🗝️.', endgame: '2⭐ per different color in grid.' } },
  // Big end-game payoffs (expensive)
  { id: 'K28', name: 'Her Majesty the Queen', cost: 8, shields: ['Az'], deck: 'Keep', endgame: 'vpPerNeighborColors:Az,Ve,Am:2', text: { endgame: '2⭐ per Azure/Verdant/Amber neighbor.' } },
  { id: 'K29', name: 'The Cathedral', cost: 8, shields: ['Vi', 'Vi'], deck: 'Keep', endgame: 'vpPerColorInGrid:Vi:3', text: { endgame: '3⭐ per Violet in grid.' } },
  { id: 'K30', name: 'Royal Treasury', cost: 7, shields: ['Az'], deck: 'Keep', cofferCapacity: 14, endgame: 'coffer', text: { endgame: 'Coffer(14).' } },
  { id: 'K31', name: 'The Archive', cost: 7, shields: ['Ve', 'Ve'], deck: 'Keep', endgame: 'vpPerColumnWithColor:Ve:4', text: { endgame: '4⭐ per column with a Verdant.' } },
  { id: 'K32', name: 'Lord Chamberlain', cost: 8, shields: ['Az', 'Vi'], deck: 'Keep', onHire: 'gainCoins:3', endgame: 'vpPerLeaderTrack:3', text: { onHire: 'Gain 3🪙.', endgame: '3⭐ per Influence 1st place.' } },
  // Interaction & tempo
  { id: 'K33', name: 'Spymaster', cost: 4, shields: ['Az'], deck: 'Keep', onHire: 'opponentsLoseKeys:1', endgame: 'vpIfNoSharedNeighbor:2', text: { onHire: 'Each opponent loses 1🗝️.', endgame: '2⭐ if no neighbor shares a color.' } },
  { id: 'K34', name: 'Tax Collector', cost: 5, shields: ['Az'], deck: 'Keep', onHire: 'opponentsPayCoins:1', text: { onHire: 'Each opponent pays you 1🪙.' } },
  { id: 'K35', name: 'Diplomat', cost: 4, shields: ['Ve'], deck: 'Keep', onHire: 'advTwoInfluence', endgame: 'vpPerLeaderTrack:2', text: { onHire: 'Advance two tracks +1.', endgame: '2⭐ per track you lead.' } },
  { id: 'K36', name: 'Inquisitor', cost: 5, shields: ['Vi'], deck: 'Keep', onHire: 'opponentsMissingColorPay:2', endgame: 'vpPerNeighborColor:Vi:2', text: { onHire: 'Opponents missing a color give you 2🪙.', endgame: '2⭐ per Violet neighbor.' } },
  // Flexible / wild
  { id: 'K37', name: 'The Regent', cost: 7, shields: ['Az', 'Az'], deck: 'Keep', onHire: 'gainKeys:1', pulse: 'advInfluence:Az', endgame: 'vpPerColorMinusColor:Az:2:Go:2', text: { onHire: 'Gain 1🗝️.', pulse: 'Advance Azure +1.', endgame: '2⭐/Azure; −2⭐/Gold.' } },
  { id: 'K38', name: 'Pilgrim', cost: 3, shields: ['Vi'], deck: 'Keep', onHire: 'discountNext:2', endgame: 'vpIfAdjCenter:2', text: { onHire: '−2 cost to next buy.', endgame: '2⭐ if adjacent to center.' } },
  { id: 'K39', name: 'Court Painter', cost: 4, shields: ['Ve'], deck: 'Keep', onHire: 'coinsPerMarketColor:1', endgame: 'vpPerColorsInGrid:1', text: { onHire: 'Gain 1🪙 per color in market.', endgame: '1⭐ per different color in grid.' } },
  { id: 'K40', name: 'Herald of Dawn', cost: 2, shields: ['Az'], deck: 'Keep', moveHeraldTo: 'Court', onHire: 'mayMoveHerald|gainCoins:1', endgame: 'vpIfTopRow:2', text: { onHire: 'Move Herald; gain 1🪙. ➡️Court', endgame: '2⭐ if in top row.' } },
  { id: 'K41', name: 'Reliquary', cost: 6, shields: ['Vi'], deck: 'Keep', cofferCapacity: 6, onHire: 'gainKeys:1', endgame: 'cofferPlusNeighborColor:Vi:1', text: { onHire: 'Gain 1🗝️.', endgame: 'Coffer(6) + 1⭐ per Violet neighbor.' } },
  { id: 'K42', name: 'The Observatory', cost: 6, shields: ['Ve', 'Ve'], deck: 'Keep', pulse: 'advInfluence:Ve|gainCoins:1', endgame: 'vpIfCell:2:3', text: { pulse: 'Advance Verdant +1; gain 1🪙.', endgame: '3⭐ if top-right corner.' } },
  { id: 'K43', name: 'Lady of the Keep', cost: 7, shields: ['Az'], deck: 'Keep', onHire: 'gainCoins:2|gainKeys:1', endgame: 'vpPerColorInRow:Az:3', text: { onHire: 'Gain 2🪙, 1🗝️.', endgame: '3⭐ per Azure in its row.' } },
  { id: 'K44', name: 'The Grand Hall', cost: 8, shields: ['Az', 'Ve'], deck: 'Keep', pulse: 'coinsPerNeighbor:1', endgame: 'vpPerNeighbor:2', text: { pulse: 'Gain 1🪙 per neighbor.', endgame: '2⭐ per neighbor.' } },
  { id: 'K45', name: 'The Oracle', cost: 6, shields: ['Ve'], deck: 'Keep', onHire: 'peekDecks', pulse: 'advInfluenceAny', endgame: 'vpPerColorInColumn:Ve:2', text: { onHire: 'Peek top of each deck; may discard one.', pulse: 'Advance any Influence +1.', endgame: '2⭐ per Verdant in column.' } },
]

// ---------------------------------------------------------------------------
// COURT DECK (Commons — skews Cr / Am / Go) — 45 cards C01..C45
// ---------------------------------------------------------------------------
export const COURT_CARDS: CardDef[] = [
  // Economy & Engine (cheap)
  { id: 'C01', name: 'Farmhand', cost: 1, shields: ['Go'], deck: 'Court', onHire: 'gainCoins:2', pulse: 'gainCoins:1', text: { onHire: 'Gain 2🪙.', pulse: 'Gain 1🪙.' } },
  { id: 'C02', name: "Blacksmith's Boy", cost: 1, shields: ['Cr'], deck: 'Court', onHire: 'gainKeys:1', endgame: 'vpIfAdjColor:Cr:2', text: { onHire: 'Gain 1🗝️.', endgame: '2⭐ if adjacent to another Crimson.' } },
  { id: 'C03', name: 'Market Crier', cost: 1, shields: ['Am'], deck: 'Court', onHire: 'gainCoins:1|mayMoveHerald', endgame: 'vpPerColorInRow:Am:1', text: { onHire: 'Gain 1🪙; may move Herald.', endgame: '1⭐ per Amber in its row.' } },
  { id: 'C04', name: 'Miller', cost: 2, shields: ['Go'], deck: 'Court', pulse: 'coinsPerNeighborColor:Go:1', text: { pulse: 'Gain 1🪙 per Gold neighbor.' } },
  { id: 'C05', name: 'Tanner', cost: 2, shields: ['Am'], deck: 'Court', onHire: 'gainCoins:2|gainKeys:1', endgame: 'vpPerKeyHeld:1:6', text: { onHire: 'Gain 2🪙, 1🗝️.', endgame: '1⭐ per key (max 6).' } },
  { id: 'C06', name: 'Granary', cost: 2, shields: ['Go'], deck: 'Court', cofferCapacity: 4, endgame: 'coffer', text: { endgame: 'Coffer(4).' } },
  { id: 'C07', name: 'Ratcatcher', cost: 2, shields: ['Cr'], deck: 'Court', pulse: 'coinsIfEdge:1', text: { pulse: 'Gain 1🪙 if on an edge cell.' } },
  { id: 'C08', name: 'Village Beekeeper', cost: 3, shields: ['Go'], deck: 'Court', cofferCapacity: 6, onHire: 'gainCoins:2', endgame: 'coffer', text: { onHire: 'Gain 2🪙.', endgame: 'Coffer(6).' } },
  // Shield / Set scorers (mid)
  { id: 'C09', name: 'Surveyor', cost: 3, shields: ['Am'], deck: 'Court', endgame: 'vpPerColorInColumn:Am:2', text: { endgame: '2⭐ per Amber in its column.' } },
  { id: 'C10', name: 'Captain', cost: 4, shields: ['Cr', 'Cr'], deck: 'Court', onHire: 'gainKeys:1', endgame: 'vpPerOtherAdjColor:Cr:3', text: { onHire: 'Gain 1🗝️.', endgame: '3⭐ per other adjacent Crimson.' } },
  { id: 'C11', name: 'Wheelwright', cost: 4, shields: ['Am'], deck: 'Court', onHire: 'discountNext:1', endgame: 'vpPerColorsInRow:2', text: { onHire: '−1 cost to next buy.', endgame: '2⭐ per different color in its row.' } },
  { id: 'C12', name: 'Town Herald', cost: 3, shields: ['Go'], deck: 'Court', onHire: 'mayMoveHerald|gainKeys:1', endgame: 'vpPerColorInGrid:Go:1', text: { onHire: 'Move Herald; gain 1🗝️.', endgame: '1⭐ per Gold in grid.' } },
  { id: 'C13', name: 'Drill Sergeant', cost: 4, shields: ['Cr'], deck: 'Court', pulse: 'advInfluence:Cr', endgame: 'vpIfLeaderTrack:Cr:4', text: { pulse: 'Advance Crimson +1.', endgame: '4⭐ if 1st on Crimson.' } },
  { id: 'C14', name: 'Houndmaster', cost: 3, shields: ['Cr'], deck: 'Court', pulse: 'coinsPerNeighborColor:Cr:1', text: { pulse: 'Gain 1🪙 per Crimson neighbor.' } },
  { id: 'C15', name: 'Guild Archive', cost: 5, shields: ['Am', 'Am'], deck: 'Court', onHire: 'gainKeys:1', endgame: 'vpPerColorInGrid:Am:2', text: { onHire: 'Gain 1🗝️.', endgame: '2⭐ per Amber in grid.' } },
  { id: 'C16', name: 'Innkeeper', cost: 4, shields: ['Go'], deck: 'Court', onHire: 'coinsIfNeighborColor:Vi:3', endgame: 'vpPerNeighborColor:Go:2', text: { onHire: 'If a neighbor is Violet, gain 3🪙.', endgame: '2⭐ per Gold neighbor.' } },
  { id: 'C17', name: 'Guild Treasurer', cost: 5, shields: ['Am'], deck: 'Court', cofferCapacity: 8, endgame: 'coffer', text: { endgame: 'Coffer(8).' } },
  { id: 'C18', name: 'Festival Fool', cost: 4, shields: ['Go'], deck: 'Court', onHire: 'gainCoins:2', endgame: 'vpIfCenter:3', text: { onHire: 'Gain 2🪙.', endgame: '3⭐ if in center.' } },
  // Position scorers (mid)
  { id: 'C19', name: 'Watchman', cost: 3, shields: ['Cr'], deck: 'Court', onHire: 'gainKeys:1', endgame: 'vpIfCorner:3', text: { onHire: 'Gain 1🗝️.', endgame: '3⭐ if in a corner.' } },
  { id: 'C20', name: 'Town Square', cost: 4, shields: ['Am'], deck: 'Court', pulse: 'advInfluenceAny', endgame: 'vpPerCardInRow:2', text: { pulse: 'Advance any Influence +1.', endgame: '2⭐ per card in its row.' } },
  { id: 'C21', name: 'General', cost: 5, shields: ['Cr', 'Cr'], deck: 'Court', onHire: 'gainKeys:1', endgame: 'vpPerColorInCross:Cr:2', text: { onHire: 'Gain 1🗝️.', endgame: '2⭐ per Crimson in its row+column.' } },
  { id: 'C22', name: 'Strongbox', cost: 5, shields: ['Go'], deck: 'Court', cofferCapacity: 10, endgame: 'coffer', text: { endgame: 'Coffer(10).' } },
  // Engines (mid-high)
  { id: 'C23', name: 'Brewer', cost: 5, shields: ['Am'], deck: 'Court', onHire: 'gainCoins:3', pulse: 'gainCoins:1|advInfluence:Am', text: { onHire: 'Gain 3🪙.', pulse: 'Gain 1🪙; advance Amber +1.' } },
  { id: 'C24', name: 'Moneylender', cost: 6, shields: ['Go'], deck: 'Court', pulse: 'gainCoins:2', endgame: 'vpPerCoins:3:1', text: { pulse: 'Gain 2🪙.', endgame: '1⭐ per 3 coins held.' } },
  { id: 'C25', name: 'Quartermaster', cost: 5, shields: ['Cr'], deck: 'Court', onHire: 'gainKeys:1', pulse: 'gainKeyIfFew:3', endgame: 'vpPerKeyHeld:1:8', text: { onHire: 'Gain 1🗝️.', pulse: 'Gain 1🗝️ if fewer than 3 keys.', endgame: '1⭐ per key (max 8).' } },
  { id: 'C26', name: 'Guildmaster', cost: 6, shields: ['Am'], deck: 'Court', pulse: 'advInfluence:Am|gainCoins:1', endgame: 'vpIfLeaderTrack:Am:3', text: { pulse: 'Advance Amber +1; gain 1🪙.', endgame: '3⭐ if 1st on Amber.' } },
  { id: 'C27', name: 'Master of Arms', cost: 6, shields: ['Cr', 'Am'], deck: 'Court', onHire: 'gainCoins:2|gainKeys:1', endgame: 'vpPerColorsInGrid:2', text: { onHire: 'Gain 2🪙, 1🗝️.', endgame: '2⭐ per different color in grid.' } },
  // Big end-game payoffs (expensive)
  { id: 'C28', name: 'The Baroness', cost: 8, shields: ['Go'], deck: 'Court', endgame: 'vpPerNeighborColors:Go,Cr,Am:2', text: { endgame: '2⭐ per Gold/Crimson/Amber neighbor.' } },
  { id: 'C29', name: 'The Great Market', cost: 8, shields: ['Am', 'Am'], deck: 'Court', endgame: 'vpPerColorInGrid:Am:3', text: { endgame: '3⭐ per Amber in grid.' } },
  { id: 'C30', name: 'Grand Vault', cost: 7, shields: ['Go'], deck: 'Court', cofferCapacity: 14, endgame: 'coffer', text: { endgame: 'Coffer(14).' } },
  { id: 'C31', name: 'The Barracks', cost: 7, shields: ['Cr', 'Cr'], deck: 'Court', endgame: 'vpPerRowWithColor:Cr:4', text: { endgame: '4⭐ per row with a Crimson.' } },
  { id: 'C32', name: 'Lord Mayor', cost: 8, shields: ['Go', 'Am'], deck: 'Court', onHire: 'gainCoins:3', endgame: 'vpPerLeaderTrack:3', text: { onHire: 'Gain 3🪙.', endgame: '3⭐ per Influence 1st place.' } },
  // Interaction & tempo
  { id: 'C33', name: 'Smuggler', cost: 4, shields: ['Am'], deck: 'Court', onHire: 'stealCoins:1', endgame: 'vpIfNoSharedNeighbor:2', text: { onHire: 'Each opponent loses 1🪙; you gain it.', endgame: '2⭐ if no neighbor shares a color.' } },
  { id: 'C34', name: 'Mercenary', cost: 5, shields: ['Cr'], deck: 'Court', onHire: 'opponentsPayCoins:1', endgame: 'vpPerNeighborColor:Cr:2', text: { onHire: 'Each opponent pays you 1🪙.', endgame: '2⭐ per Crimson neighbor.' } },
  { id: 'C35', name: 'Envoy', cost: 4, shields: ['Am'], deck: 'Court', onHire: 'advTwoInfluence', endgame: 'vpPerLeaderTrack:2', text: { onHire: 'Advance two tracks +1.', endgame: '2⭐ per track you lead.' } },
  { id: 'C36', name: 'Agitator', cost: 5, shields: ['Cr'], deck: 'Court', onHire: 'opponentsMissingColorPay:2', endgame: 'vpPerNeighborColor:Cr:2', text: { onHire: 'Opponents missing a color give you 2🪙.', endgame: '2⭐ per Crimson neighbor.' } },
  // Flexible / wild
  { id: 'C37', name: 'The Warlord', cost: 7, shields: ['Cr', 'Cr'], deck: 'Court', onHire: 'gainKeys:1', pulse: 'advInfluence:Cr', endgame: 'vpPerColorMinusColor:Cr:2:Az:2', text: { onHire: 'Gain 1🗝️.', pulse: 'Advance Crimson +1.', endgame: '2⭐/Crimson; −2⭐/Azure.' } },
  { id: 'C38', name: 'Wanderer', cost: 3, shields: ['Go'], deck: 'Court', onHire: 'discountNext:2', endgame: 'vpIfAdjCenter:2', text: { onHire: '−2 cost to next buy.', endgame: '2⭐ if adjacent to center.' } },
  { id: 'C39', name: 'Street Artist', cost: 4, shields: ['Am'], deck: 'Court', onHire: 'coinsPerMarketColor:1', endgame: 'vpPerColorsInGrid:1', text: { onHire: 'Gain 1🪙 per color in market.', endgame: '1⭐ per different color in grid.' } },
  { id: 'C40', name: 'Dawn Peddler', cost: 2, shields: ['Go'], deck: 'Court', moveHeraldTo: 'Keep', onHire: 'mayMoveHerald|gainCoins:1', endgame: 'vpIfBottomRow:2', text: { onHire: 'Move Herald; gain 1🪙. ➡️Keep', endgame: '2⭐ if in bottom row.' } },
  { id: 'C41', name: 'Shrine', cost: 6, shields: ['Am'], deck: 'Court', cofferCapacity: 6, onHire: 'gainKeys:1', endgame: 'cofferPlusNeighborColor:Am:1', text: { onHire: 'Gain 1🗝️.', endgame: 'Coffer(6) + 1⭐ per Amber neighbor.' } },
  { id: 'C42', name: 'The Arena', cost: 6, shields: ['Cr', 'Cr'], deck: 'Court', pulse: 'advInfluence:Cr|gainCoins:1', endgame: 'vpIfCell:6:3', text: { pulse: 'Advance Crimson +1; gain 1🪙.', endgame: '3⭐ if bottom-left corner.' } },
  { id: 'C43', name: 'The Baron', cost: 7, shields: ['Go'], deck: 'Court', onHire: 'gainCoins:2|gainKeys:1', endgame: 'vpPerColorInRow:Go:3', text: { onHire: 'Gain 2🪙, 1🗝️.', endgame: '3⭐ per Gold in its row.' } },
  { id: 'C44', name: 'The Fairgrounds', cost: 8, shields: ['Go', 'Am'], deck: 'Court', pulse: 'coinsPerNeighbor:1', endgame: 'vpPerNeighbor:2', text: { pulse: 'Gain 1🪙 per neighbor.', endgame: '2⭐ per neighbor.' } },
  { id: 'C45', name: 'The Seer', cost: 6, shields: ['Am'], deck: 'Court', onHire: 'peekDecks', pulse: 'advInfluenceAny', endgame: 'vpPerColorInColumn:Am:2', text: { onHire: 'Peek top of each deck; may discard one.', pulse: 'Advance any Influence +1.', endgame: '2⭐ per Amber in column.' } },
]

export const ALL_CARDS: CardDef[] = [...KEEP_CARDS, ...COURT_CARDS]

// ---------------------------------------------------------------------------
// EDICTS (shared objectives) — 18 cards E1..E18
// ---------------------------------------------------------------------------
export const EDICTS: EdictDef[] = [
  { id: 'E1', name: 'Royal Symmetry', text: '+6⭐ if every column has an Azure OR every column has a Gold.', score: 'everyColumnColor:Az:Go:6' },
  { id: 'E2', name: 'The Full Keep', text: '+5⭐ if you have zero face-down cards.', score: 'noFaceDown:5' },
  { id: 'E3', name: 'Diverse Court', text: '+2⭐ per different shield color in your grid.', score: 'perColorInGrid:2' },
  { id: 'E4', name: 'Corner Lords', text: '+3⭐ per corner holding a 2-shield card.', score: 'cornerTwoShield:3' },
  { id: 'E5', name: 'Central Power', text: '+8⭐ if center shares a color with all four neighbors.', score: 'centerSharesAll:8' },
  { id: 'E6', name: 'Keymaster', text: '+2⭐ per key held (max 16).', score: 'perKey:2:16' },
  { id: 'E7', name: 'The Hoard', text: '+1⭐ per 2 coins stored in coffers (max 15).', score: 'perCofferPair:1:15' },
  { id: 'E8', name: 'Monochrome Row', text: '+7⭐ if any row is a single shield color.', score: 'monochromeRow:7' },
  { id: 'E9', name: 'Rainbow Column', text: '+7⭐ if any column shows three different colors.', score: 'rainbowColumn:7' },
  { id: 'E10', name: 'Influence Baron', text: '+4⭐ per Influence track you finish 1st on.', score: 'perLeaderTrack:4' },
  { id: 'E11', name: 'Balanced Realm', text: '+10⭐ if 4+ colors present and no color appears >3 times.', score: 'balancedRealm:10' },
  { id: 'E12', name: 'The Fortress', text: '+2⭐ per edge cell holding a Crimson.', score: 'edgeColor:Cr:2' },
  { id: 'E13', name: 'Faithful Court', text: '+2⭐ per Violet; −1⭐ per Crimson.', score: 'colorMinusColor:Vi:2:Cr:1' },
  { id: 'E14', name: 'Warmongers', text: '+2⭐ per Crimson; −1⭐ per Violet.', score: 'colorMinusColor:Cr:2:Vi:1' },
  { id: 'E15', name: 'The Great Chain', text: '+3⭐ per adjacent same-color pair.', score: 'sameColorPairs:3' },
  { id: 'E16', name: 'Merchant Prince', text: '+12⭐ if 0 loose coins and ≥1 coffer card.', score: 'merchantPrince:12' },
  { id: 'E17', name: 'The Spire', text: '+6⭐ if top row has more shields than bottom row.', score: 'spire:6' },
  { id: 'E18', name: "Pilgrim's Path", text: '+2⭐ per Violet adjacent to a Verdant.', score: 'adjacentColorPair:Vi:Ve:2' },
]

export const STARTER_EDICTS = ['E1', 'E2', 'E3']

// Sanity: expected counts (used by tests / dev assertions)
export const EXPECTED_KEEP = 45
export const EXPECTED_COURT = 45
export const EXPECTED_EDICTS = 18
