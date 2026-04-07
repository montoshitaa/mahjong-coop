import React from 'react';
import { Player } from '../types';

interface ScoreboardProps {
  players: Player[];
  currentPlayerId: string | null;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentPlayerId }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getMedal = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  };

  const getPlayerColor = (index: number) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full h-full bg-[#12122a] rounded-xl border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
      <div className="px-4 py-2 border-b border-slate-800 bg-slate-800/20 flex justify-between items-center">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scoreboard</h2>
        <span className="text-[10px] text-slate-500 font-mono">{players.length} Players</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <tbody className="divide-y divide-slate-800/50">
            {sortedPlayers.map((player, index) => {
              const isMe = player.id === currentPlayerId;
              const medal = getMedal(index);
              
              return (
                <tr 
                  key={player.id} 
                  className={`transition-colors duration-200 ${isMe ? 'bg-blue-900/10 border-l-2 border-blue-500' : 'hover:bg-slate-800/30 border-l-2 border-transparent'}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${player.isConnected ? getPlayerColor(index) : 'bg-slate-600'}`} />
                      <div className="flex flex-col">
                        <span className={`text-sm font-semibold ${isMe ? 'text-blue-400' : player.isConnected ? 'text-slate-200' : 'text-slate-500'}`}>
                          {player.name}
                          {!player.isConnected && <span className="ml-2 text-[10px] opacity-50 italic">(offline)</span>}
                        </span>
                        {medal && <span className="text-xs">{medal} Rank {index + 1}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-2xl font-black text-white font-mono tracking-tighter">{player.score}</span>
                  </td>
                </tr>
              );
            })}
            {players.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-slate-500 italic text-sm">
                  Waiting for players...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Scoreboard;
