/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Clock, Users, Sparkles, RotateCcw } from 'lucide-react';
import useSocket from './hooks/useSocket';
import Lobby from './components/Lobby';
import Board from './components/Board';
import PlayerCard from './components/PlayerCard';
import LiveChart from './components/LiveChart';
import { getPlayerColor, PlayerColor } from './constants/playerColors';

export default function App() {
  const { 
    gameState, 
    isConnected, 
    currentPlayerId, 
    joinGame, 
    selectTile,
    requestHint,
    hintPair,
    wasReshuffled
  } = useSocket();

  const [highlightFree, setHighlightFree] = useState(true);
  const [time, setTime] = useState('00:00');

  const hasJoined = useMemo(() => {
    return gameState?.players.some(p => p.id === currentPlayerId);
  }, [gameState?.players, currentPlayerId]);

  const playerColorMap = useMemo(() => {
    const map: Record<string, PlayerColor> = {};
    if (gameState) {
      gameState.players.forEach((p, i) => {
        map[p.id] = getPlayerColor(i);
      });
    }
    return map;
  }, [gameState?.players]);

  const activePlayerId = useMemo(() => {
    if (!gameState) return null;
    // Find player who has a tile locked
    const lockedTile = gameState.tiles.find(t => t.lockedBy !== null);
    if (lockedTile) return lockedTile.lockedBy;
    return null;
  }, [gameState?.tiles]);

  const sortedPlayers = useMemo(() => {
    if (!gameState) return [];
    return [...gameState.players].sort((a, b) => b.score - a.score);
  }, [gameState?.players]);

  const winner = useMemo(() => {
    if (!gameState?.isGameOver || !gameState.players.length) return null;
    return sortedPlayers[0];
  }, [gameState?.isGameOver, sortedPlayers]);

  const pairsRemaining = useMemo(() => {
    if (!gameState) return 0;
    return gameState.tiles.filter(t => !t.isMatched).length / 2;
  }, [gameState?.tiles]);

  useEffect(() => {
    if (!gameState?.startTime || gameState.isGameOver) return;

    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - gameState.startTime!) / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setTime(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState?.startTime, gameState?.isGameOver]);

  if (!gameState || !hasJoined) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center p-4 selection:bg-blue-500/30">
        <Lobby joinGame={joinGame} isConnected={isConnected} />
      </div>
    );
  }

  const renderPlayerCards = () => {
    const players = gameState.players;
    const cards = players.map((player) => {
      const rank = sortedPlayers.findIndex(p => p.id === player.id) + 1;
      return (
        <PlayerCard
          key={player.id}
          player={player}
          color={playerColorMap[player.id]}
          isCurrentTurn={activePlayerId === player.id || (activePlayerId === null && player.id === currentPlayerId)}
          isCurrentPlayer={player.id === currentPlayerId}
          rank={rank}
        />
      );
    });

    const positions = [
      "bottom-8 left-1/2 -translate-x-1/2", // Player 0
      "top-8 left-1/2 -translate-x-1/2",    // Player 1
      "right-8 top-1/2 -translate-y-1/2 rotate-90 origin-center", // Player 2
      "left-8 top-1/2 -translate-y-1/2 -rotate-90 origin-center", // Player 3
    ];

    return cards.map((card, i) => (
      <div key={players[i].id} className={`absolute z-50 transition-all duration-500 ${positions[i]}`}>
        {card}
      </div>
    ));
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a1a] text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-12 flex-shrink-0 bg-[#0d0d1a] border-b border-slate-800 px-6 flex items-center justify-between z-40">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black tracking-tighter text-[#39ff14] flex items-center gap-2">
            <span className="text-2xl">麻将</span>
            MAHJONG
          </h1>
          <div className="h-4 w-px bg-slate-800" />
          <button 
            onClick={() => setHighlightFree(!highlightFree)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${highlightFree ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 'bg-slate-800 text-slate-500 border border-transparent'}`}
          >
            <Sparkles className="w-3 h-3" />
            {highlightFree ? 'Highlight ON' : 'Highlight OFF'}
          </button>
          <button
            onClick={requestHint}
            disabled={hintPair !== null}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${hintPair ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'} bg-[#0a2e0a] text-[#39ff14] border border-[#39ff14]/30`}
          >
            <Sparkles className="w-3 h-3" />
            💡 Hint
          </button>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 font-mono text-xl font-bold text-white bg-black/40 px-4 py-0.5 rounded-md border border-slate-800">
            <Clock className="w-4 h-4 text-slate-500" />
            {time}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-xs font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
            <span className="text-lg font-black">{pairsRemaining}</span>
            PAIRS LEFT
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`} />
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 relative overflow-hidden p-4 flex items-center justify-center">
        {renderPlayerCards()}
        
        <div className="w-full h-full max-w-[1100px] max-h-[700px]">
          <Board 
            tiles={gameState.tiles} 
            currentPlayerId={currentPlayerId} 
            onSelectTile={selectTile}
            highlightFree={highlightFree}
            playerColorMap={playerColorMap}
            hintPair={hintPair}
          />
        </div>

        {/* Reshuffle Notification */}
        <AnimatePresence>
          {wasReshuffled && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className="fixed top-20 left-1/2 z-[9999] bg-[#1a1a00] border border-[#ffcc00] text-[#ffcc00] px-6 py-3 rounded-xl font-mono text-sm shadow-[0_0_20px_rgba(255,204,0,0.3)] flex items-center gap-3"
            >
              <RotateCcw className="w-4 h-4 animate-spin-slow" />
              🔀 No moves left — board reshuffled!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Live Chart in corner */}
        <div className="absolute bottom-4 right-4 w-64 h-32 opacity-40 hover:opacity-100 transition-opacity z-10">
          <LiveChart scoreHistory={gameState.scoreHistory} players={gameState.players} />
        </div>
      </main>

      {/* Victory Overlay */}
      <AnimatePresence>
        {gameState.isGameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-2xl w-full bg-[#12122a] border border-slate-800 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(57,255,20,0.2)]"
            >
              <div className="text-8xl mb-6">🏆</div>
              
              <h2 className="text-5xl font-black text-white mb-2 tracking-tighter uppercase">Victory!</h2>
              <p className="text-slate-400 mb-8 text-lg">The board has been cleared in record time.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-black/40 rounded-2xl p-6 border border-slate-800">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Winner</div>
                  <div className="text-3xl font-black text-[#39ff14] tracking-tight">{winner?.name}</div>
                  <div className="text-sm text-slate-400 mt-1">{winner?.score} matches</div>
                </div>
                <div className="bg-black/40 rounded-2xl p-6 border border-slate-800">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Total Time</div>
                  <div className="text-3xl font-black text-white font-mono">{time}</div>
                  <div className="text-sm text-slate-400 mt-1">Elapsed</div>
                </div>
              </div>

              <div className="w-full mb-10 max-h-48 overflow-y-auto custom-scrollbar flex flex-wrap justify-center gap-4">
                {gameState.players.map(p => (
                  <PlayerCard 
                    key={p.id}
                    player={p}
                    color={playerColorMap[p.id]}
                    isCurrentTurn={false}
                    isCurrentPlayer={p.id === currentPlayerId}
                    rank={sortedPlayers.findIndex(sp => sp.id === p.id) + 1}
                  />
                ))}
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="group relative inline-flex items-center gap-3 px-10 py-4 bg-[#39ff14] text-black font-black rounded-full transition-all hover:scale-105 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                <RotateCcw className="w-6 h-6 relative z-10" />
                <span className="text-xl relative z-10">PLAY AGAIN</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
