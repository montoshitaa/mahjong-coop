import { Server as SocketIOServer, Socket } from 'socket.io';
import { createGame, addPlayer, removePlayer, selectTile, reshuffleIfDeadlocked } from './game';
import { GameState } from './types';

let gameState: GameState = createGame();

export function setupSocket(io: SocketIOServer): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on('player:join', ({ name }: { name: string }) => {
      gameState = addPlayer(gameState, socket.id, name);
      io.emit('game:state', gameState);
    });

    socket.on('tile:select', ({ tileId }: { tileId: string }) => {
      const { newState, event, reshuffled } = selectTile(gameState, tileId, socket.id);
      gameState = newState;
      io.emit('game:state', gameState);

      if (reshuffled) {
        io.emit('game:reshuffled');
      }

      if (event === 'no-match') {
        setTimeout(() => {
          io.emit('game:state', gameState);
        }, 1000);
      }
    });

    socket.on('game:hint', () => {
      // Find first valid pair among free tiles
      const free = gameState.tiles.filter(t => t.isFree && !t.isMatched);
      const symbolMap: Record<string, string> = {};
      let hintPair: [string, string] | null = null;

      for (const tile of free) {
        if (symbolMap[tile.symbol]) {
          hintPair = [symbolMap[tile.symbol], tile.id];
          break;
        }
        symbolMap[tile.symbol] = tile.id;
      }

      // Emit hint only to the requesting socket (not broadcast)
      socket.emit('game:hint:result', hintPair);
    });

    socket.on('disconnect', () => {
      console.log(`Player disconnected: ${socket.id}`);
      gameState = removePlayer(gameState, socket.id);
      io.emit('game:state', gameState);
    });
  });
}
