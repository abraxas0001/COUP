import { Game } from './Game.js';

export class GameManager {
  constructor(io) {
    this.io = io;
    this.games = new Map();
    this.playerGameMap = new Map();
  }

  createGame(lobby) {
    const playerData = lobby.players.map(p => ({
      id: p.id,
      name: p.name,
      avatarId: p.avatarId
    }));
    
    const game = new Game(lobby.id, playerData);
    this.games.set(lobby.id, game);
    
    // Map players to game
    playerData.forEach(p => {
      this.playerGameMap.set(p.id, lobby.id);
    });
    
    return game;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  getGameByPlayer(playerId) {
    const gameId = this.playerGameMap.get(playerId);
    return gameId ? this.games.get(gameId) : null;
  }

  handleAction(gameId, playerId, action, targetId, card) {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: 'Game not found' };
    }
    
    return game.declareAction(playerId, action, targetId);
  }

  handleChallenge(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: 'Game not found' };
    }
    
    return game.processChallenge(playerId);
  }

  handleBlock(gameId, playerId, claimedCard) {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: 'Game not found' };
    }
    
    return game.processBlock(playerId, claimedCard);
  }

  handleAllow(gameId, playerId) {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: 'Game not found' };
    }
    
    return game.processAllow(playerId);
  }

  handleInfluenceLoss(gameId, playerId, cardIndex) {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: 'Game not found' };
    }
    
    return game.processInfluenceSelection(playerId, cardIndex);
  }

  handleExchange(gameId, playerId, selectedCards) {
    const game = this.games.get(gameId);
    if (!game) {
      return { success: false, error: 'Game not found' };
    }
    
    return game.processExchange(playerId, selectedCards);
  }

  handleDisconnect(playerId, onGameUpdate) {
    const gameId = this.playerGameMap.get(playerId);
    if (!gameId) return;
    
    const game = this.games.get(gameId);
    if (!game) return;
    
    const player = game.getPlayer(playerId);
    if (player && !player.isEliminated) {
      // Mark player as eliminated due to disconnect
      player.isEliminated = true;
      player.influence.forEach(i => i.revealed = true);
      game.addToLog(`${player.name} disconnected and is eliminated`, 'elimination');
      
      // Check for winner
      const alivePlayers = game.getAlivePlayers();
      if (alivePlayers.length === 1) {
        game.winner = alivePlayers[0];
        game.phase = 'gameOver';
        game.addToLog(`${game.winner.name} wins the game!`, 'victory');
      } else if (alivePlayers.length === 0) {
        game.phase = 'gameOver';
        game.addToLog('Game ended - all players disconnected', 'info');
      }
      
      // If it was the current player's turn, move to next
      if (game.getCurrentPlayer()?.id === playerId) {
        game.nextTurn();
      }
      
      if (onGameUpdate) {
        onGameUpdate(game);
      }
      
      // Clean up game after all players disconnect
      if (alivePlayers.length === 0) {
        setTimeout(() => {
          this.deleteGame(gameId);
        }, 5000); // 5 second delay to allow final state updates
      }
    }
    
    this.playerGameMap.delete(playerId);
  }

  deleteGame(gameId) {
    const game = this.games.get(gameId);
    if (game) {
      console.log(`🧹 Cleaning up game: ${gameId}`);
      game.players.forEach(p => {
        this.playerGameMap.delete(p.id);
      });
      this.games.delete(gameId);
    }
  }
  
  // Clean up finished games after 10 minutes
  scheduleGameCleanup(gameId) {
    setTimeout(() => {
      const game = this.games.get(gameId);
      if (game && game.phase === 'gameOver') {
        console.log(`⏰ Auto-cleaning up finished game: ${gameId}`);
        this.deleteGame(gameId);
      }
    }, 10 * 60 * 1000); // 10 minutes
  }
}
