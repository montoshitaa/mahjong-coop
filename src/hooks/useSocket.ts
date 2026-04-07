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
}

const SERVER_URL = import.meta.env.VITE_SERVER_URL || window.location.origin;

const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const socket = io(SERVER_URL);
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

    return () => {
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

  return {
    socket: socketRef.current,
    gameState,
    isConnected,
    currentPlayerId,
    joinGame,
    selectTile,
  };
};

export default useSocket;
