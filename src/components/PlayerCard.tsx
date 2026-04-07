import React from 'react';
import { Player } from '../types';
import { PlayerColor } from '../constants/playerColors';

interface PlayerCardProps {
  player: Player;
  color: PlayerColor;
  isCurrentTurn: boolean;
  isCurrentPlayer: boolean;
  rank: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  color, 
  isCurrentTurn, 
  isCurrentPlayer, 
  rank 
}) => {
  const getMedal = (r: number) => {
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    if (r === 3) return '🥉';
    return null;
  };

  const initials = player.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className={`
        relative w-[280px] h-[72px] flex items-center gap-4 px-4 rounded-xl overflow-hidden
        transition-all duration-400 cubic-bezier(0.4, 0, 0.2, 1)
        backdrop-blur-md border-l-4
        ${isCurrentTurn 
          ? 'scale-[1.03] z-10' 
          : 'opacity-55 brightness-[0.75]'}
      `}
      style={{
        background: 'var(--playercard-bg)',
        borderLeftColor: color.primary,
        boxShadow: isCurrentTurn ? `${color.primary}99 0 0 12px` : `${color.primary}33 0 0 8px`,
      }}
    >
      {/* Active Turn Indicator — Glowing Vine */}
      {isCurrentTurn && (
        <div 
          className="absolute top-2 right-2 text-lg animate-vine-wiggle"
          style={{ filter: `drop-shadow(0 0 8px ${color.primary})` }}
        >
          🌿
        </div>
      )}

      {/* Avatar */}
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 border-2"
        style={{ 
          background: `radial-gradient(circle, ${color.primary}, ${color.secondary})`,
          borderColor: color.primary,
          color: '#ffffff',
          boxShadow: `0 0 12px ${color.primary}80`
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="font-bold truncate" style={{ color: isCurrentPlayer ? 'var(--player-name-active)' : 'var(--player-name-inactive)' }}>
            {player.name}
          </span>
          {isCurrentPlayer && (
            <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--player-label)' }}>@you</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getMedal(rank) && <span className="text-sm">{getMedal(rank)}</span>}
          <span className="text-xs font-mono" style={{ color: 'var(--player-label)' }}>Rank {rank}</span>
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <div 
          className="text-3xl font-black font-mono tracking-tighter"
          style={{ 
            color: 'var(--score-font-color)',
            textShadow: `0 0 8px ${color.primary}`
          }}
        >
          {player.score}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
