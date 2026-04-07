export interface Tile {
  id: string;
  symbol: string;
  x: number;       // horizontal grid position
  y: number;       // vertical grid position
  z: number;       // layer/level (0 = base, higher = on top)
  isFlipped: boolean;
  isMatched: boolean;
  isFree: boolean; // computed: no tile above AND at least one side free
  lockedBy: string | null;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  isConnected: boolean;
}

export interface ScoreSnapshot {
  timestamp: number;
  scores: Record<string, number>;
}

export interface GameState {
  tiles: Tile[];
  players: Player[];
  scoreHistory: ScoreSnapshot[];
  isGameOver: boolean;
  startTime: number | null;
}
