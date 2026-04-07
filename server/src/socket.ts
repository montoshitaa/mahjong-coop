import { Server as SocketIOServer, Socket } from 'socket.io';
import { createGame, addPlayer, removePlayer, selectTile } from './game';
import { GameState } from './types';

let gameState: GameState = createGame(15);

export function setupSocket(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on('player:join', ({ name }: { name: string }) => {
      gameState = addPlayer(gameState, socket.id, name);
      io.emit('game:state', gameState);
    });

    socket.on('tile:select', ({ tileId }: { tileId: string }) => {
      const { newState, event } = selectTile(gameState, tileId, socket.id);
      gameState = newState;
      io.emit('game:state', gameState);

      if (event === 'no-match') {
        setTimeout(() => {
          // The checkMatch function in game.ts already resets the tiles synchronously
          // but the user wants to emit the state again after 1000ms.
          // In game.ts, checkMatch resets flipped/locked state if no match.
          // So we just emit the current gameState which already has them reset.
          io.emit('game:state', gameState);
        }, 1000);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      gameState = removePlayer(gameState, socket.id);
      io.emit('game:state', gameState);
    });
  });
}
