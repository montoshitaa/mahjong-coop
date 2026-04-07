export const PLAYER_COLORS = [
  {
    id: 0,
    dark:  { primary: '#4fc3f7', secondary: '#1a3a5c', glow: '0 0 12px #4fc3f7', particle: '#4fc3f7' },
    light: { primary: '#0277bd', secondary: '#e1f5fe', glow: '0 0 12px #0277bd', particle: '#0277bd' },
  },
  {
    id: 1,
    dark:  { primary: '#ef5350', secondary: '#4a1010', glow: '0 0 12px #ef5350', particle: '#ef5350' },
    light: { primary: '#c62828', secondary: '#ffebee', glow: '0 0 12px #c62828', particle: '#c62828' },
  },
  {
    id: 2,
    dark:  { primary: '#66bb6a', secondary: '#0a2e0a', glow: '0 0 12px #66bb6a', particle: '#66bb6a' },
    light: { primary: '#2e7d32', secondary: '#e8f5e9', glow: '0 0 12px #2e7d32', particle: '#2e7d32' },
  },
  {
    id: 3,
    dark:  { primary: '#ce93d8', secondary: '#2a0a3a', glow: '0 0 12px #ce93d8', particle: '#ce93d8' },
    light: { primary: '#7b1fa2', secondary: '#f3e5f5', glow: '0 0 12px #7b1fa2', particle: '#7b1fa2' },
  },
];

export function getPlayerColor(index: number, theme: 'dark' | 'light' = 'dark') {
  const entry = PLAYER_COLORS[index % PLAYER_COLORS.length];
  return entry[theme];
}

export type PlayerColor = ReturnType<typeof getPlayerColor>;
