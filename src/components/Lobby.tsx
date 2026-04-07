import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Users, Play, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';

interface LobbyProps {
  joinGame: (name: string) => void;
  isConnected: boolean;
}

const Lobby: React.FC<LobbyProps> = ({ joinGame, isConnected }) => {
  const [name, setName] = useState('');
  const { theme, toggleTheme } = useTheme();

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
      className="max-w-md w-full bg-[var(--bg-panel)] border border-[var(--header-border)] rounded-3xl p-8 shadow-[var(--board-shadow)] relative"
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-xl border border-[var(--header-border)] hover:scale-105 active:scale-95 transition-all"
        style={{ color: 'var(--title-color)' }}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--jungle-green)]/10 rounded-2xl mb-4 border border-[var(--jungle-green)]/20">
          <span className="text-4xl">🀄</span>
        </div>
        <h1 className="text-3xl font-black tracking-tighter mb-2 uppercase" style={{ color: 'var(--title-color)', textShadow: 'var(--title-glow)' }}>
          Mahjong <span style={{ color: 'var(--jungle-green)' }}>Jungle</span>
        </h1>
        <p className="text-[var(--text-secondary)] text-sm font-medium">Multiplayer Battle Arena</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2 ml-1">
            Enter Player Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MasterMahjong"
            maxLength={15}
            className="w-full bg-[var(--jungle-surface)]/40 border border-[var(--header-border)] rounded-xl px-4 py-3 text-[var(--title-color)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--jungle-green)]/50 focus:ring-1 focus:ring-[var(--jungle-green)]/20 transition-all"
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={!name.trim() || !isConnected}
          className={`w-full group relative flex items-center justify-center gap-3 py-4 rounded-xl font-black transition-all overflow-hidden ${
            name.trim() && isConnected 
              ? 'bg-[var(--jungle-green)] text-black hover:scale-[1.02] active:scale-[0.98]' 
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

      <div className="mt-8 pt-6 border-t border-[var(--header-border)]/50">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
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
        <div className="bg-[var(--bg-overlay)] rounded-lg p-3 border border-[var(--header-border)]/30">
          <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase mb-1">Objective</div>
          <div className="text-[11px] text-[var(--text-secondary)] leading-tight">Match pairs of free tiles to score points.</div>
        </div>
        <div className="bg-[var(--bg-overlay)] rounded-lg p-3 border border-[var(--header-border)]/30">
          <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase mb-1">Free Tiles</div>
          <div className="text-[11px] text-[var(--text-secondary)] leading-tight">Tiles with no tile on top and at least one side open.</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Lobby;
