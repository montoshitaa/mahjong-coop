import { GameState, Player, ScoreSnapshot, Tile } from './types';

const SYMBOLS = ['🀇', '🀈', '🀉', '🀊', '🀋', '🀌', '🀍', '🀎', '🀏', '🀙', '🀚', '🀛', '🀜', '🀝', '🀞', '🀟', '🀠'];

function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function createGame(pairCount: number): GameState {
  const selectedSymbols = SYMBOLS.slice(0, pairCount);
  const tileSymbols = [...selectedSymbols, ...selectedSymbols];
  const shuffledSymbols = shuffle(tileSymbols);

  const tiles: Tile[] = shuffledSymbols.map((symbol, index) => ({
    id: `tile-${index}`,
    symbol,
    isFlipped: false,
    isMatched: false,
    lockedBy: null,
  }));

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

  const newTiles = state.tiles.map(t => 
    t.lockedBy === id ? { ...t, lockedBy: null, isFlipped: false } : t
  );

  return {
    ...state,
    players: newPlayers,
    tiles: newTiles,
  };
}

export function selectTile(state: GameState, tileId: string, playerId: string): { newState: GameState; event: string | null } {
  const tile = state.tiles.find(t => t.id === tileId);
  
  // Reject if tile is already matched or locked by another player
  if (!tile || tile.isMatched || (tile.lockedBy && tile.lockedBy !== playerId)) {
    return { newState: state, event: null };
  }

  // Find if the player already has a locked tile
  const previouslyLockedTile = state.tiles.find(t => t.lockedBy === playerId);

  if (!previouslyLockedTile) {
    // Lock this tile
    const newTiles = state.tiles.map(t => 
      t.id === tileId ? { ...t, lockedBy: playerId, isFlipped: true } : t
    );
    return { 
      newState: { ...state, tiles: newTiles }, 
      event: 'tile:locked' 
    };
  } else if (previouslyLockedTile.id !== tileId) {
    // Player already has a different locked tile, check match
    const result = checkMatch(state, previouslyLockedTile.id, tileId, playerId);
    return { 
      newState: result.newState, 
      event: result.isMatch ? 'match' : 'no-match' 
    };
  } else {
    // Player clicked the same tile they already locked, ignore
    return { newState: state, event: null };
  }
}

export function checkMatch(state: GameState, t1Id: string, t2Id: string, playerId: string): { newState: GameState; isMatch: boolean } {
  const t1 = state.tiles.find(t => t.id === t1Id);
  const t2 = state.tiles.find(t => t.id === t2Id);

  if (!t1 || !t2) return { newState: state, isMatch: false };

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

  const isGameOver = newTiles.every(t => t.isMatched);

  return {
    newState: {
      ...state,
      tiles: newTiles,
      players: newPlayers,
      scoreHistory: newScoreHistory,
      isGameOver,
    },
    isMatch,
  };
}
