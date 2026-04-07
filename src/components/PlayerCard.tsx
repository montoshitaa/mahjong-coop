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
        backgroundColor: `${color.secondary}CC`, // 80% opacity
        borderLeftColor: color.primary,
        boxShadow: isCurrentTurn ? color.glow : 'none',
      }}
    >
      {/* Active Turn Indicator */}
      {isCurrentTurn && (
        <div 
          className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: color.primary }}
        />
      )}

      {/* Avatar */}
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
        style={{ 
          backgroundColor: color.primary,
          color: color.secondary
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className={`font-bold truncate ${isCurrentPlayer ? 'text-white' : 'text-slate-300'}`}>
            {player.name}
          </span>
          {isCurrentPlayer && (
            <span className="text-[10px] text-slate-500 font-bold uppercase">@you</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getMedal(rank) && <span className="text-sm">{getMedal(rank)}</span>}
          <span className="text-xs text-slate-500 font-mono">Rank {rank}</span>
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <div 
          className="text-3xl font-black font-mono tracking-tighter"
          style={{ color: color.primary }}
        >
          {player.score}
        </div>
      </div>

      {/* Active Turn Arrow */}
      {isCurrentTurn && (
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 animate-pulse"
          style={{ color: color.primary }}
        >
          ▶
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
