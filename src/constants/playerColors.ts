export const PLAYER_COLORS = [
  {
    id: 0,
    name: 'blue',
    primary:    '#4fc3f7',
    secondary:  '#1a3a5c',
    glow:       '0 0 12px #4fc3f7, 0 0 24px #1e88e5',
    particle:   '#4fc3f7',
    border:     '#1e88e5',
    text:       '#e3f2fd',
    dim:        'rgba(79, 195, 247, 0.15)',
  },
  {
    id: 1,
    name: 'red',
    primary:    '#ef5350',
    secondary:  '#4a1010',
    glow:       '0 0 12px #ef5350, 0 0 24px #c62828',
    particle:   '#ef5350',
    border:     '#c62828',
    text:       '#ffebee',
    dim:        'rgba(239, 83, 80, 0.15)',
  },
  {
    id: 2,
    name: 'green',
    primary:    '#66bb6a',
    secondary:  '#0a2e0a',
    glow:       '0 0 12px #66bb6a, 0 0 24px #2e7d32',
    particle:   '#66bb6a',
    border:     '#2e7d32',
    text:       '#e8f5e9',
    dim:        'rgba(102, 187, 106, 0.15)',
  },
  {
    id: 3,
    name: 'purple',
    primary:    '#ce93d8',
    secondary:  '#2a0a3a',
    glow:       '0 0 12px #ce93d8, 0 0 24px #7b1fa2',
    particle:   '#ce93d8',
    border:     '#7b1fa2',
    text:       '#f3e5f5',
    dim:        'rgba(206, 147, 216, 0.15)',
  },
];

export function getPlayerColor(index: number) {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export type PlayerColor = typeof PLAYER_COLORS[0];
