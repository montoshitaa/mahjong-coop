import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Tile as TileType } from '../types';
import { PlayerColor } from '../constants/playerColors';
import { TILE_W, TILE_H } from '../constants/boardLayout';

interface TileProps {
  tile: TileType;
  currentPlayerId: string | null;
  onSelect: (id: string) => void;
  playerColorMap: Record<string, PlayerColor>;
  isHinted?: boolean;
}

const Tile: React.FC<TileProps> = React.memo(({ tile, currentPlayerId, onSelect, playerColorMap, isHinted }) => {
  const { id, symbol, isMatched, lockedBy, isFree } = tile;
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isLockedByMe = lockedBy === currentPlayerId;
  const isLockedByOther = lockedBy !== null && !isLockedByMe;
  const isBlocked = !isFree && !isMatched;

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
  let faceBackground = 'var(--tile-free-bg)';
  let faceBorder = '1.5px solid var(--tile-free-border)';
  let faceShadow = 'var(--tile-free-shadow)';
  const clickable = isFree && !lockedBy;

  if (isBlocked) {
    faceBackground = 'var(--tile-blocked-bg)';
    faceBorder = '1px solid var(--tile-blocked-border)';
    faceShadow = 'none';
  } else if (isHinted && isFree && !isMatched) {
    faceBackground = 'var(--hint-btn-bg)';
    faceBorder = '2px solid var(--hint-btn-border)';
    faceShadow = 'var(--glow-green)';
  } else if (isLockedByMe) {
    const color = playerColorMap[currentPlayerId || ''];
    if (color) {
      faceBackground = `linear-gradient(145deg, ${color.secondary}, #0a1a1a)`;
      faceBorder = `2px solid ${color.primary}`;
      faceShadow = color.glow;
    }
  } else if (isLockedByOther) {
    const color = playerColorMap[lockedBy || ''];
    if (color) {
      faceBackground = `linear-gradient(145deg, ${color.secondary}, #1a0a0a)`;
      faceBorder = `2px solid ${color.primary}99`;
      faceShadow = `0 0 8px ${color.primary}`;
    }
  } else if (isHovered && isFree) {
    faceShadow = 'var(--tile-hover-shadow)';
  }

  return (
    <div 
      style={{
        width: TILE_W + 8,
        height: TILE_H + 8,
        overflow: 'visible',
        position: 'absolute',
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bottom edge — darkest stone */}
      {!isMatched && (
        <div style={{
          position: 'absolute',
          bottom: 0, left: 4,
          width: TILE_W,
          height: TILE_H,
          background: 'var(--tile-edge-bottom)',
          borderRadius: '7px',
          zIndex: 1,
        }} />
      )}

      {/* Right edge — dark stone */}
      {!isMatched && (
        <div style={{
          position: 'absolute',
          top: 4, right: 0,
          width: TILE_W,
          height: TILE_H,
          background: 'var(--tile-edge-right)',
          borderRadius: '7px',
          zIndex: 2,
        }} />
      )}

      {/* Main face */}
      <div 
        className={`${isLockedByMe ? "animate-pulse-selected" : ""} ${isHinted && isFree && !isMatched ? "animate-hint-pulse" : ""}`}
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: TILE_W,
          height: TILE_H,
          borderRadius: '6px',
          background: faceBackground,
          border: faceBorder,
          boxShadow: faceShadow,
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          cursor: clickable ? 'pointer' : 'not-allowed',
          transition: 'transform 0.12s ease, box-shadow 0.12s ease, filter 0.2s ease',
          transform: isHovered && isFree && !isMatched ? 'translateY(-3px) translateX(-1px)' : 'none',
          overflow: 'hidden',
          opacity: isMatched ? 0 : 1,
        }}
      >
        {/* Stone texture overlay — subtle noise pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(0,0,0,0.1) 0%, transparent 50%)
          `,
          borderRadius: '6px',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Top highlight — light hitting stone surface */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '35%',
          background: 'var(--tile-free-top-highlight)',
          borderRadius: '6px 6px 0 0',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        {/* Symbol */}
        <span style={{
          fontSize: 26,
          lineHeight: 1,
          zIndex: 3,
          position: 'relative',
          filter: isBlocked ? 'var(--symbol-filter-blocked)' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
          opacity: isMatched ? 0 : (isBlocked ? 0.4 : 1),
          transition: 'opacity 0.2s, filter 0.2s',
          fontFamily: "'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif",
        }}>
          {tile.symbol}
        </span>

        {/* Rune corner marks — tiny decorative dots on free tiles */}
        {isFree && !isMatched && (
          <>
            {['topleft','topright','bottomleft','bottomright'].map(pos => (
              <div key={pos} style={{
                position: 'absolute',
                width: 4, height: 4,
                borderRadius: '50%',
                background: 'var(--tile-rune-dot)',
                ...(pos === 'topleft'     ? { top: 4, left: 4 }       : {}),
                ...(pos === 'topright'    ? { top: 4, right: 4 }      : {}),
                ...(pos === 'bottomleft'  ? { bottom: 4, left: 4 }    : {}),
                ...(pos === 'bottomright' ? { bottom: 4, right: 4 }   : {}),
                zIndex: 4,
              }} />
            ))}
          </>
        )}

        {/* Blocked overlay — dark moss/shadow */}
        {isBlocked && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'var(--tile-blocked-overlay)',
            borderRadius: '6px',
            backdropFilter: 'blur(0.5px)',
            zIndex: 5,
          }} />
        )}

        {/* Plus One Animation */}
        <AnimatePresence>
          {showPlusOne && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              zIndex: 10,
            }}>
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
