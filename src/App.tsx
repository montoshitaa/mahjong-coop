/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, Users, Activity } from 'lucide-react';
import useSocket from './hooks/useSocket';
import Lobby from './components/Lobby';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import LiveChart from './components/LiveChart';

export default function App() {
  const { 
    gameState, 
    isConnected, 
    currentPlayerId, 
    joinGame, 
    selectTile 
  } = useSocket();

  const hasJoined = useMemo(() => {
    return gameState?.players.some(p => p.id === currentPlayerId);
  }, [gameState?.players, currentPlayerId]);

  const winner = useMemo(() => {
    if (!gameState?.isGameOver || !gameState.players.length) return null;
    return [...gameState.players].sort((a, b) => b.score - a.score)[0];
  }, [gameState?.isGameOver, gameState?.players]);

  const elapsedTime = useMemo(() => {
    if (!gameState?.startTime) return '0:00';
    const end = gameState.isGameOver ? (gameState.scoreHistory[gameState.scoreHistory.length - 1]?.timestamp || Date.now()) : Date.now();
    const seconds = Math.floor((end - gameState.startTime) / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, [gameState?.startTime, gameState?.isGameOver, gameState?.scoreHistory]);

  if (!gameState || !hasJoined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-blue-500/30">
        <Lobby joinGame={joinGame} isConnected={isConnected} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-900/20">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Mahjong Colaborativo</h1>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{elapsedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span>{gameState.players.filter(p => p.isConnected).length} Online</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
              <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Board and Chart */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <Board 
              tiles={gameState.tiles} 
              currentPlayerId={currentPlayerId} 
              onSelectTile={selectTile} 
            />
          </section>
          
          <section>
            <LiveChart 
              scoreHistory={gameState.scoreHistory} 
              players={gameState.players} 
            />
          </section>
        </div>

        {/* Right Column: Scoreboard */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28">
            <Scoreboard 
              players={gameState.players} 
              currentPlayerId={currentPlayerId} 
            />
          </div>
        </aside>
      </main>

      {/* Victory Overlay */}
      <AnimatePresence>
        {gameState.isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center shadow-2xl"
            >
              <div className="inline-flex p-4 bg-yellow-500/10 rounded-full mb-6">
                <Trophy className="w-12 h-12 text-yellow-500" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">Game Over!</h2>
              <p className="text-slate-400 mb-8">All tiles have been matched.</p>
              
              <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 space-y-4">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Winner</div>
                  <div className="text-2xl font-bold text-blue-400">{winner?.name}</div>
                  <div className="text-sm text-slate-400">{winner?.score} matches found</div>
                </div>
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Time</div>
                  <div className="text-xl font-semibold text-white">{elapsedTime}</div>
                </div>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
              >
                Play Again
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 text-center border-t border-slate-900">
        <p className="text-slate-600 text-sm">
          Collaborative Mahjong &bull; Built with React, Socket.io & Framer Motion
        </p>
      </footer>
    </div>
  );
}
