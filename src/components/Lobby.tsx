import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Users, Play } from 'lucide-react';

interface LobbyProps {
  joinGame: (name: string) => void;
  isConnected: boolean;
}

const Lobby: React.FC<LobbyProps> = ({ joinGame, isConnected }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && isConnected) {
      joinGame(name.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-[#0d0d1a] border border-slate-800 rounded-3xl p-8 shadow-[0_0_50px_rgba(57,255,20,0.1)]"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#39ff14]/10 rounded-2xl mb-4 border border-[#39ff14]/20">
          <span className="text-4xl">🀄</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-2 uppercase">
          Mahjong <span className="text-[#39ff14]">Solitaire</span>
        </h1>
        <p className="text-slate-400 text-sm font-medium">Multiplayer Battle Arena</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 ml-1">
            Enter Player Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MasterMahjong"
            maxLength={15}
            className="w-full bg-black/40 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-[#39ff14]/50 focus:ring-1 focus:ring-[#39ff14]/20 transition-all"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim() || !isConnected}
          className={`w-full group relative flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all overflow-hidden ${
            name.trim() && isConnected 
              ? 'bg-[#39ff14] text-black hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          {name.trim() && isConnected && (
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
          )}
          <Play className="w-5 h-5 relative z-10" />
          <span className="text-lg relative z-10 uppercase tracking-tight">Enter Arena</span>
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-800/50">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="w-3 h-3" />
            <span>Up to 4 Players</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={isConnected ? 'text-green-500' : 'text-red-500'}>
              {isConnected ? 'Server Online' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="bg-black/20 rounded-lg p-3 border border-slate-800/30">
          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Objective</div>
          <div className="text-[11px] text-slate-300 leading-tight">Match pairs of free tiles to score points.</div>
        </div>
        <div className="bg-black/20 rounded-lg p-3 border border-slate-800/30">
          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Free Tiles</div>
          <div className="text-[11px] text-slate-300 leading-tight">Tiles with no tile on top and at least one side open.</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Lobby;
