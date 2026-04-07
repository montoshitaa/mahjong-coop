import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Tile as TileType } from '../types';
import { PlayerColor } from '../constants/playerColors';
import { TILE_W, TILE_H } from '../constants/boardLayout';

interface TileProps {
  tile: TileType;
  currentPlayerId: string | null;
  onSelect: (id: string) => void;
  highlightFree: boolean;
  playerColorMap: Record<string, PlayerColor>;
  isHinted?: boolean;
}

const Tile: React.FC<TileProps> = React.memo(({ tile, currentPlayerId, onSelect, highlightFree, playerColorMap, isHinted }) => {
  const { id, symbol, isMatched, lockedBy, isFree } = tile;
  const [showPlusOne, setShowPlusOne] = useState(false);

  const isLockedByMe = lockedBy === currentPlayerId;
  const isLockedByOther = lockedBy !== null && !isLockedByMe;

  useEffect(() => {
    if (isMatched) {
      setShowPlusOne(true);
      const timer = setTimeout(() => setShowPlusOne(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isMatched]);

  const handleClick = () => {
    if (isFree && !isMatched && !lockedBy) {
      onSelect(id);
    }
  };

  // Determine styling based on state
  let background = isFree ? '#f5f0e8' : '#2a2a3e';
  let borderStyle = isFree ? '2px solid #c8a96e' : '1px solid #3a3a4e';
  let shadowStyle = isFree ? '3px 3px 0px #1a1a2e, 4px 4px 0px #0d0d1a' : '1px 1px 0px #0d0d1a';
  let cursor = isFree && !lockedBy ? 'pointer' : (isLockedByOther ? 'not-allowed' : 'default');

  if (isHinted && isFree && !isMatched) {
    background = '#0a2e0a';
    borderStyle = '2px solid #39ff14';
    shadowStyle = '0 0 16px #39ff14, 0 0 32px rgba(57,255,20,0.4)';
  } else if (isLockedByMe) {
    const color = playerColorMap[currentPlayerId || ''];
    if (color) {
      background = color.secondary;
      borderStyle = `2px solid ${color.primary}`;
      shadowStyle = color.glow;
    }
  } else if (isLockedByOther) {
    const color = playerColorMap[lockedBy || ''];
    if (color) {
      background = color.secondary;
      borderStyle = `2px solid ${color.primary}B3`; // 70% opacity
      shadowStyle = `0 0 8px ${color.primary}`;
    }
  }

  return (
    <div 
      style={{
        width: TILE_W,
        height: TILE_H,
        overflow: 'visible',
        position: 'absolute',
        cursor,
      }}
      onClick={handleClick}
    >
      {/* 3D shadow layers */}
      <div style={{   // right edge shadow
        position: 'absolute',
        top: 3, left: TILE_W,
        width: 6, height: TILE_H,
        background: '#1a1a2e',
        borderRadius: '0 4px 4px 0',
        display: isMatched ? 'none' : 'block',
      }} />
      <div style={{   // bottom edge shadow
        position: 'absolute',
        top: TILE_H, left: 3,
        width: TILE_W, height: 6,
        background: '#0d0d1a',
        borderRadius: '0 0 4px 4px',
        display: isMatched ? 'none' : 'block',
      }} />

      {/* tile face */}
      <div 
        className={`${isLockedByMe ? "animate-pulse-selected" : ""} ${isHinted && isFree && !isMatched ? "animate-hint-pulse" : ""}`}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: TILE_W, height: TILE_H,
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          background,
          border: borderStyle,
          boxShadow: shadowStyle,
          zIndex: 1,
          opacity: isMatched ? 0 : 1,
          transition: 'all 0.15s ease',
          borderTop: highlightFree && isFree && !lockedBy && !isHinted ? "2px solid rgba(255, 255, 255, 0.6)" : borderStyle,
        }}
      >
        {/* symbol — ALWAYS render, never conditional */}
        <span style={{
          opacity: isMatched ? 0 : (isFree || lockedBy ? 1 : 0.38),
          filter: isFree || lockedBy ? 'none' : 'grayscale(85%)',
          fontFamily: "'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', sans-serif",
          fontSize: 26,
          lineHeight: '1',
          display: 'block',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          {symbol}
        </span>

        {/* blocked overlay */}
        {!isFree && !isMatched && !lockedBy && (
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 6,
            background: 'rgba(0,0,0,0.42)',
            pointerEvents: 'none',
          }} />
        )}

        {/* Plus One Animation */}
        <AnimatePresence>
          {showPlusOne && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
              <span className="text-green-400 font-bold text-xl animate-float-up">+1</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

Tile.displayName = 'Tile';

export default Tile;
