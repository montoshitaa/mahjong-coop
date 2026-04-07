import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState } from '../types';

interface UseSocketReturn {
  socket: Socket | null;
  gameState: GameState | null;
  isConnected: boolean;
  currentPlayerId: string | null;
  joinGame: (name: string) => void;
  selectTile: (tileId: string) => void;
  requestHint: () => void;
  hintPair: [string, string] | null;
  wasReshuffled: boolean;
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin;

const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reshuffleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [hintPair, setHintPair] = useState<[string, string] | null>(null);
  const [wasReshuffled, setWasReshuffled] = useState<boolean>(false);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setCurrentPlayerId(socket.id || null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('game:state', (state: GameState) => {
      setGameState(state);
    });

    socket.on('game:hint:result', (pair: [string, string] | null) => {
      setHintPair(pair);
      
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      hintTimerRef.current = setTimeout(() => {
        setHintPair(null);
        hintTimerRef.current = null;
      }, 3000);
    });

    socket.on('game:reshuffled', () => {
      setWasReshuffled(true);
      
      if (reshuffleTimerRef.current) clearTimeout(reshuffleTimerRef.current);
      reshuffleTimerRef.current = setTimeout(() => {
        setWasReshuffled(false);
        reshuffleTimerRef.current = null;
      }, 2500);
    });

    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
      if (reshuffleTimerRef.current) clearTimeout(reshuffleTimerRef.current);
      socket.disconnect();
    };
  }, []);

  const joinGame = (name: string) => {
    if (socketRef.current) {
      socketRef.current.emit('player:join', { name });
    }
  };

  const selectTile = (tileId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('tile:select', { tileId });
    }
  };

  const requestHint = () => {
    if (socketRef.current) {
      socketRef.current.emit('game:hint');
    }
  };

  return {
    socket: socketRef.current,
    gameState,
    isConnected,
    currentPlayerId,
    joinGame,
    selectTile,
    requestHint,
    hintPair,
    wasReshuffled,
  };
};

export default useSocket;
