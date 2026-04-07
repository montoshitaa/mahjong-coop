import React, { useState, useEffect, useRef, useMemo } from 'react';
import Tile from './Tile';
import MatchBurst from './MatchBurst';
import { Tile as TileType } from '../types';
import { PlayerColor } from '../constants/playerColors';
import { 
  tileToPixel, 
  CELL_W, 
  CELL_H, 
  OFFSET_X, 
  OFFSET_Y, 
  BOARD_PAD_X, 
  BOARD_PAD_Y, 
  TILE_W, 
  TILE_H 
} from '../constants/boardLayout';

interface BoardProps {
  tiles: TileType[];
  currentPlayerId: string | null;
  onSelectTile: (id: string) => void;
  highlightFree: boolean;
  playerColorMap: Record<string, PlayerColor>;
  hintPair: [string, string] | null;
}

interface Burst {
  id: string;
  x: number;
  y: number;
  color: string;
}

const Board: React.FC<BoardProps> = ({ tiles, currentPlayerId, onSelectTile, highlightFree, playerColorMap, hintPair }) => {
  const [bursts, setBursts] = useState<Burst[]>([]);
  const prevTilesRef = useRef<TileType[]>([]);

  const boardDimensions = useMemo(() => {
    if (tiles.length === 0) return { width: 800, height: 400 };
    
    const maxX = Math.max(...tiles.map(t => t.x));
    const maxY = Math.max(...tiles.map(t => t.y));
    const maxZ = Math.max(...tiles.map(t => t.z));

    const boardWidth  = maxX * CELL_W + maxZ * OFFSET_X + BOARD_PAD_X * 2 + TILE_W + 20;
    const boardHeight = maxY * CELL_H + BOARD_PAD_Y * 2 + TILE_H + 20;

    return { width: boardWidth, height: boardHeight };
  }, [tiles]);

  useEffect(() => {
    const prevTiles = prevTilesRef.current;
    if (prevTiles.length > 0) {
      const newlyMatched = tiles.filter(t => t.isMatched && !prevTiles.find(pt => pt.id === t.id)?.isMatched);
      
      if (newlyMatched.length > 0) {
        const newBursts: Burst[] = [];
        
        newlyMatched.forEach(tile => {
          const prevTile = prevTiles.find(pt => pt.id === tile.id);
          const matcherId = prevTile?.lockedBy;
          const color = playerColorMap[matcherId || '']?.particle || '#ffffff';

          const pos = tileToPixel(tile.x, tile.y, tile.z);

          newBursts.push({
            id: `${tile.id}-${Date.now()}`,
            x: pos.left + TILE_W / 2,
            y: pos.top + TILE_H / 2,
            color
          });
        });

        setBursts(prev => [...prev, ...newBursts]);
      }
    }
    prevTilesRef.current = tiles;
  }, [tiles, playerColorMap]);

  const removeBurst = (id: string) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}
    >
      <div 
        style={{
          position: 'relative',
          width: boardDimensions.width,
          height: boardDimensions.height,
          minWidth: 700,
          minHeight: 400,
          margin: '0 auto',
          overflow: 'visible',
        }}
      >
        {tiles.map((tile) => {
          const pos = tileToPixel(tile.x, tile.y, tile.z);
          const isHinted = hintPair !== null && hintPair.includes(tile.id);

          return (
            <div
              key={tile.id}
              style={{
                position: 'absolute',
                left: `${pos.left}px`,
                top: `${pos.top}px`,
                width: `${TILE_W}px`,
                height: `${TILE_H}px`,
                zIndex: pos.zIndex,
                display: tile.isMatched ? 'none' : 'block',
              }}
            >
              <Tile 
                tile={tile} 
                currentPlayerId={currentPlayerId} 
                onSelect={onSelectTile}
                highlightFree={highlightFree}
                playerColorMap={playerColorMap}
                isHinted={isHinted}
              />
            </div>
          );
        })}

        {/* Particle Bursts */}
        {bursts.map(burst => (
          <MatchBurst 
            key={burst.id}
            x={burst.x}
            y={burst.y}
            color={burst.color}
            onComplete={() => removeBurst(burst.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
