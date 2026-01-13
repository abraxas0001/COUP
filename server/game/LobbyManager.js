import { v4 as uuidv4 } from 'uuid';

// Generate a readable 6-character lobby code
function generateLobbyCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

class Lobby {
  constructor(hostId, hostName, avatarId) {
    this.id = generateLobbyCode();
    this.hostId = hostId;
    this.createdAt = Date.now();
    this.gameStarted = false;
    this.maxPlayers = 6;
    this.players = [
      {
        id: hostId,
        name: hostName,
        avatarId: avatarId || 1,
        isHost: true,
        isReady: true, // Host is always ready
        joinedAt: Date.now()
      }
    ];
  }

  addPlayer(playerId, playerName, avatarId) {
    if (this.players.length >= this.maxPlayers) {
      throw new Error('Lobby is full');
    }
    
    if (this.gameStarted) {
      throw new Error('Game has already started');
    }
    
    if (this.players.find(p => p.id === playerId)) {
      throw new Error('You are already in this lobby');
    }

    this.players.push({
      id: playerId,
      name: playerName,
      avatarId: avatarId || Math.floor(Math.random() * 5) + 1,
      isHost: false,
      isReady: false,
      joinedAt: Date.now()
    });
  }

  removePlayer(playerId) {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return null;
    
    const removedPlayer = this.players[playerIndex];
    this.players.splice(playerIndex, 1);
    
    // If host left, assign new host
    if (removedPlayer.isHost && this.players.length > 0) {
      this.players[0].isHost = true;
      this.players[0].isReady = true;
      this.hostId = this.players[0].id;
    }
    
    return removedPlayer;
  }

  toggleReady(playerId) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found in lobby');
    }
    
    // Host is always ready
    if (!player.isHost) {
      player.isReady = !player.isReady;
    }
    
    return player.isReady;
  }

  canStart() {
    return this.players.length >= 2 && this.players.every(p => p.isReady);
  }

  getPublicState() {
    return {
      id: this.id,
      hostId: this.hostId,
      players: this.players.map(p => ({
        id: p.id,
        name: p.name,
        avatarId: p.avatarId,
        isHost: p.isHost,
        isReady: p.isReady
      })),
      canStart: this.canStart(),
      gameStarted: this.gameStarted,
      playerCount: this.players.length,
      maxPlayers: this.maxPlayers
    };
  }
}

export class LobbyManager {
  constructor() {
    this.lobbies = new Map();
    this.playerLobbyMap = new Map(); // Track which lobby each player is in
  }

  createLobby(hostId, hostName, avatarId) {
    // Check if player is already in a lobby
    if (this.playerLobbyMap.has(hostId)) {
      const existingLobbyCode = this.playerLobbyMap.get(hostId);
      this.leaveLobby(existingLobbyCode, hostId);
    }

    const lobby = new Lobby(hostId, hostName, avatarId);
    this.lobbies.set(lobby.id, lobby);
    this.playerLobbyMap.set(hostId, lobby.id);
    
    return lobby;
  }

  joinLobby(lobbyCode, playerId, playerName, avatarId) {
    const lobby = this.lobbies.get(lobbyCode.toUpperCase());
    if (!lobby) {
      throw new Error('Lobby not found. Check the code and try again.');
    }

    // Leave any existing lobby first
    if (this.playerLobbyMap.has(playerId)) {
      const existingLobbyCode = this.playerLobbyMap.get(playerId);
      if (existingLobbyCode !== lobbyCode) {
        this.leaveLobby(existingLobbyCode, playerId);
      }
    }

    lobby.addPlayer(playerId, playerName, avatarId);
    this.playerLobbyMap.set(playerId, lobby.id);
    
    return lobby;
  }

  leaveLobby(lobbyCode, playerId) {
    const lobby = this.lobbies.get(lobbyCode);
    if (!lobby) {
      return { lobby: null };
    }

    const removedPlayer = lobby.removePlayer(playerId);
    this.playerLobbyMap.delete(playerId);
    
    // Delete empty lobbies
    if (lobby.players.length === 0) {
      this.lobbies.delete(lobbyCode);
      return { lobby: null, playerName: removedPlayer?.name };
    }
    
    return { lobby, playerName: removedPlayer?.name };
  }

  toggleReady(lobbyCode, playerId) {
    const lobby = this.lobbies.get(lobbyCode);
    if (!lobby) {
      throw new Error('Lobby not found');
    }
    
    lobby.toggleReady(playerId);
    return lobby;
  }

  getLobby(lobbyCode) {
    return this.lobbies.get(lobbyCode);
  }

  handleDisconnect(playerId) {
    const lobbyCode = this.playerLobbyMap.get(playerId);
    if (!lobbyCode) {
      return { lobby: null };
    }
    
    return this.leaveLobby(lobbyCode, playerId);
  }
}
