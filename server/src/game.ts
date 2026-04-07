import { GameState, Player, ScoreSnapshot, Tile } from './types';

const SYMBOLS = [
  '🐉', '🦁', '🐯', '🐺', '🦊', '🐻',
  '🐼', '🐨', '🦋', '🦜', '🦚', '🦩',
  '🌸', '🌺', '🌻', '🌹', '🍀', '🎋',
  '🍎', '🍊', '🍋', '🍇', '🍓', '🍑',
  '⭐', '🌙', '☀️', '❄️', '🔥', '⚡',
  '💎', '🏆', '🎯', '🎲', '🎭', '🎪',
];

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function createLayout(): { x: number; y: number; z: number }[] {
  const positions: { x: number; y: number; z: number }[] = [];

  // Layer z=0: y 0..5, x 0..9 = 60 positions
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 10; x++) {
      positions.push({ x, y, z: 0 });
    }
  }

  // Layer z=1: y 1..3, x 2..7 = 3 rows × 6 cols = 18 positions (but use only 10)
  // We'll take 10 centered positions
  const z1Positions = [
    { x: 3, y: 1, z: 1 }, { x: 4, y: 1, z: 1 }, { x: 5, y: 1, z: 1 }, { x: 6, y: 1, z: 1 },
    { x: 3, y: 2, z: 1 }, { x: 4, y: 2, z: 1 }, { x: 5, y: 2, z: 1 }, { x: 6, y: 2, z: 1 },
    { x: 4, y: 3, z: 1 }, { x: 5, y: 3, z: 1 }
  ];
  positions.push(...z1Positions);

  // Layer z=2: y 2, x 4..5 = 2 positions
  positions.push({ x: 4, y: 2, z: 2 });
  positions.push({ x: 5, y: 2, z: 2 });

  return positions;
}

function computeFreeTiles(tiles: Tile[]): Tile[] {
  return tiles.map(tile => {
    if (tile.isMatched) return { ...tile, isFree: false };

    // Rule 1: blocked above — any tile with same x,y and z = tile.z + 1
    const hasAbove = tiles.some(
      t => !t.isMatched &&
           t.z === tile.z + 1 &&
           Math.abs(t.x - tile.x) < 1 &&
           Math.abs(t.y - tile.y) < 1
    );
    if (hasAbove) return { ...tile, isFree: false };

    // Rule 2: blocked on both sides — check left (x-1) and right (x+1)
    const hasLeft = tiles.some(
      t => !t.isMatched &&
           t.z === tile.z &&
           Math.abs(t.x - (tile.x - 1)) < 0.6 &&
           Math.abs(t.y - tile.y) < 0.6
    );
    const hasRight = tiles.some(
      t => !t.isMatched &&
           t.z === tile.z &&
           Math.abs(t.x - (tile.x + 1)) < 0.6 &&
           Math.abs(t.y - tile.y) < 0.6
    );

    // Free if at least one side is open
    const isFree = !(hasLeft && hasRight);
    return { ...tile, isFree };
  });
}

function getFreeTiles(tiles: Tile[]): Tile[] {
  return computeFreeTiles(tiles).filter(t => t.isFree && !t.isMatched);
}

function hasValidMove(tiles: Tile[]): boolean {
  const free = getFreeTiles(tiles);
  const symbolCounts: Record<string, number> = {};
  for (const t of free) {
    symbolCounts[t.symbol] = (symbolCounts[t.symbol] || 0) + 1;
    if (symbolCounts[t.symbol] >= 2) return true;
  }
  return false;
}

export function reshuffleIfDeadlocked(state: GameState): { state: GameState; reshuffled: boolean } {
  if (state.isGameOver) return { state, reshuffled: false };

  if (hasValidMove(state.tiles)) return { state, reshuffled: false };

  // Deadlock detected — reshuffle unmatched tile symbols
  console.log('Deadlock detected — reshuffling remaining tiles');

  // Collect unmatched tiles and their symbols
  const unmatched = state.tiles.filter(t => !t.isMatched);
  const symbols = unmatched.map(t => t.symbol);

  // Fisher-Yates shuffle symbols
  for (let i = symbols.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [symbols[i], symbols[j]] = [symbols[j], symbols[i]];
  }

  // Reassign shuffled symbols to same positions
  const newTiles = state.tiles.map(tile => {
    if (tile.isMatched) return tile;
    const idx = unmatched.findIndex(u => u.id === tile.id);
    return { ...tile, symbol: symbols[idx], lockedBy: null, isFlipped: false };
  });

  // Recompute free state
  const recomputed = computeFreeTiles(newTiles);

  // Retry up to 10 times if still deadlocked
  const newState = { ...state, tiles: recomputed };
  if (!hasValidMove(recomputed)) {
    const result = reshuffleIfDeadlocked(newState);
    return { state: result.state, reshuffled: true };
  }

  return { state: newState, reshuffled: true };
}

export function createGame(): GameState {
  const layout = createLayout();
  const pairCount = layout.length / 2;
  const uniqueSymbols = SYMBOLS.slice(0, pairCount);
  const tileSymbols = [...uniqueSymbols, ...uniqueSymbols];
  
  let shuffledSymbols = shuffle(tileSymbols);

  const assignSymbolsToLayout = (l: { x: number; y: number; z: number }[], s: string[]): Tile[] => {
    return l.map((pos, index) => ({
      id: `tile-${index}`,
      symbol: s[index],
      x: pos.x,
      y: pos.y,
      z: pos.z,
      isFlipped: false,
      isMatched: false,
      isFree: false,
      lockedBy: null,
    }));
  };

  let tiles = assignSymbolsToLayout(layout, shuffledSymbols);
  let attempts = 0;
  while (!hasValidMove(tiles) && attempts < 100) {
    shuffledSymbols = shuffle(tileSymbols);
    tiles = assignSymbolsToLayout(layout, shuffledSymbols);
    attempts++;
  }
  if (attempts === 100) {
    console.warn('Could not find valid initial state after 100 attempts');
  }

  tiles = computeFreeTiles(tiles);

  // Verify consistency (dev only)
  console.assert(tiles.length % 2 === 0, 'Tile count must be even');
  console.assert(tiles.length === layout.length, `Tile count mismatch: ${tiles.length} vs ${layout.length}`);

  return {
    tiles,
    players: [],
    scoreHistory: [],
    isGameOver: false,
    startTime: null,
  };
}

export function addPlayer(state: GameState, id: string, name: string): GameState {
  const existingPlayerIndex = state.players.findIndex(p => p.id === id);
  let newPlayers: Player[];
  let newStartTime = state.startTime;

  if (existingPlayerIndex !== -1) {
    newPlayers = state.players.map((p, i) => 
      i === existingPlayerIndex ? { ...p, isConnected: true } : p
    );
  } else {
    const newPlayer: Player = {
      id,
      name,
      score: 0,
      isConnected: true,
    };
    newPlayers = [...state.players, newPlayer];
    if (newPlayers.length === 1 && !newStartTime) {
      newStartTime = Date.now();
    }
  }

  return {
    ...state,
    players: newPlayers,
    startTime: newStartTime,
  };
}

export function removePlayer(state: GameState, id: string): GameState {
  const newPlayers = state.players.map(p => 
    p.id === id ? { ...p, isConnected: false } : p
  );

  let newTiles = state.tiles.map(t => 
    t.lockedBy === id ? { ...t, lockedBy: null, isFlipped: false } : t
  );

  newTiles = computeFreeTiles(newTiles);

  return {
    ...state,
    players: newPlayers,
    tiles: newTiles,
  };
}

export function selectTile(state: GameState, tileId: string, playerId: string): { newState: GameState; event: string | null; reshuffled: boolean } {
  const tile = state.tiles.find(t => t.id === tileId);
  
  // Reject if tile is already matched, locked by another player, or NOT FREE
  if (!tile || tile.isMatched || !tile.isFree || (tile.lockedBy && tile.lockedBy !== playerId)) {
    return { newState: state, event: null, reshuffled: false };
  }

  // Find if the player already has a locked tile
  const previouslyLockedTile = state.tiles.find(t => t.lockedBy === playerId);

  if (!previouslyLockedTile) {
    // Lock this tile
    let newTiles = state.tiles.map(t => 
      t.id === tileId ? { ...t, lockedBy: playerId, isFlipped: true } : t
    );
    newTiles = computeFreeTiles(newTiles);
    return { 
      newState: { ...state, tiles: newTiles }, 
      event: 'tile:locked',
      reshuffled: false
    };
  } else if (previouslyLockedTile.id !== tileId) {
    // Player already has a different locked tile, check match
    const result = checkMatch(state, previouslyLockedTile.id, tileId, playerId);
    return { 
      newState: result.newState, 
      event: result.isMatch ? 'match' : 'no-match',
      reshuffled: result.reshuffled
    };
  } else {
    // Player clicked the same tile they already locked, ignore
    return { newState: state, event: null, reshuffled: false };
  }
}

export function checkMatch(state: GameState, t1Id: string, t2Id: string, playerId: string): { newState: GameState; isMatch: boolean; reshuffled: boolean } {
  const t1 = state.tiles.find(t => t.id === t1Id);
  const t2 = state.tiles.find(t => t.id === t2Id);

  if (!t1 || !t2) return { newState: state, isMatch: false, reshuffled: false };

  const isMatch = t1.symbol === t2.symbol;
  let newTiles: Tile[];
  let newPlayers = state.players;
  let newScoreHistory = state.scoreHistory;

  if (isMatch) {
    newTiles = state.tiles.map(t => 
      (t.id === t1Id || t.id === t2Id) 
        ? { ...t, isMatched: true, lockedBy: null, isFlipped: true } 
        : t
    );

    newPlayers = state.players.map(p => 
      p.id === playerId ? { ...p, score: p.score + 1 } : p
    );

    const scores: Record<string, number> = {};
    newPlayers.forEach(p => {
      scores[p.id] = p.score;
    });

    const snapshot: ScoreSnapshot = {
      timestamp: Date.now(),
      scores,
    };
    newScoreHistory = [...state.scoreHistory, snapshot];
  } else {
    // No match: set both lockedBy: null, isFlipped: false
    newTiles = state.tiles.map(t => 
      (t.id === t1Id || t.id === t2Id) 
        ? { ...t, lockedBy: null, isFlipped: false } 
        : t
    );
  }

  newTiles = computeFreeTiles(newTiles);
  const isGameOver = newTiles.every(t => t.isMatched);

  const { state: finalState, reshuffled } = reshuffleIfDeadlocked({
    ...state,
    tiles: newTiles,
    players: newPlayers,
    scoreHistory: newScoreHistory,
    isGameOver,
  });

  return {
    newState: finalState,
    isMatch,
    reshuffled
  };
}
