export const TILE_W = 52;
export const TILE_H = 66;
export const CELL_W = 60;    // TILE_W + 8px gap
export const CELL_H = 74;    // TILE_H + 8px gap
export const OFFSET_X = 5;
export const OFFSET_Y = 4;
export const BOARD_PAD_X = 48;
export const BOARD_PAD_Y = 48;

export function tileToPixel(x: number, y: number, z: number) {
  return {
    left: x * CELL_W + z * OFFSET_X + BOARD_PAD_X,
    top:  y * CELL_H - z * OFFSET_Y + BOARD_PAD_Y,
    zIndex: z * 1000 + x * 10 + (10 - y),
  };
}
