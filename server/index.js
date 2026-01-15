import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GameManager } from './game/GameManager.js';
import { LobbyManager } from './game/LobbyManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [
          'https://coup-erky.onrender.com',
          'https://coup-multi.vercel.app', // Add your specific Vercel domain
          /^https:\/\/.*\.vercel\.app$/,  // Allow all Vercel deployments
          'http://localhost:5173',
          'http://127.0.0.1:5173'
        ]
      : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['polling', 'websocket'], // Polling first for reliability
  allowEIO3: true,
  allowEIO4: true,
  pingTimeout: 60000,
  pingInterval: 25000,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e6,
  allowUpgrades: true,
  perMessageDeflate: false,
  httpCompression: false,
  cookie: false,
  serveClient: false,
  path: '/socket.io/'
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://coup-erky.onrender.com',
        'https://coup-multi.vercel.app', // Add your specific Vercel domain
        /^https:\/\/.*\.vercel\.app$/,
        'http://localhost:5173'
      ]
    : ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Coup server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: '🎭 Coup Multiplayer Game Server',
    version: '1.0.0',
    socketio: 'Connected via Socket.io'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Initialize managers
const lobbyManager = new LobbyManager();
const gameManager = new GameManager(io);

// Track active connections
const activeConnections = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);
  
  // Track connection
  activeConnections.set(socket.id, {
    connectedAt: Date.now(),
    lastActivity: Date.now(),
    socketId: socket.id
  });

  // ========================
  // HEARTBEAT / KEEP-ALIVE
  // ========================
  
  socket.on('ping', (data) => {
    // Update last activity
    const conn = activeConnections.get(socket.id);
    if (conn) {
      conn.lastActivity = Date.now();
    }
    socket.emit('pong', { timestamp: Date.now() });
  });

  // ========================
  // LOBBY EVENTS
  // ========================

  socket.on('createLobby', ({ playerName, avatarId }, callback) => {
    try {
      const lobby = lobbyManager.createLobby(socket.id, playerName, avatarId);
      socket.join(lobby.id);
      callback({ success: true, lobby: lobby.getPublicState() });
      console.log(`Lobby created: ${lobby.id} by ${playerName}`);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('joinLobby', ({ lobbyCode, playerName, avatarId }, callback) => {
    try {
      const lobby = lobbyManager.joinLobby(lobbyCode, socket.id, playerName, avatarId);
      socket.join(lobby.id);
      
      // Notify all players in lobby
      io.to(lobby.id).emit('lobbyUpdated', lobby.getPublicState());
      callback({ success: true, lobby: lobby.getPublicState() });
      console.log(`${playerName} joined lobby: ${lobby.id}`);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('leaveLobby', ({ lobbyCode }, callback) => {
    try {
      const result = lobbyManager.leaveLobby(lobbyCode, socket.id);
      socket.leave(lobbyCode);
      
      if (result.lobby) {
        io.to(lobbyCode).emit('lobbyUpdated', result.lobby.getPublicState());
      }
      callback({ success: true });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('toggleReady', ({ lobbyCode }, callback) => {
    try {
      const lobby = lobbyManager.toggleReady(lobbyCode, socket.id);
      io.to(lobbyCode).emit('lobbyUpdated', lobby.getPublicState());
      callback({ success: true });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('startGame', ({ lobbyCode }, callback) => {
    try {
      const lobby = lobbyManager.getLobby(lobbyCode);
      if (!lobby) {
        throw new Error('Lobby not found');
      }
      
      if (lobby.hostId !== socket.id) {
        throw new Error('Only the host can start the game');
      }
      
      if (!lobby.canStart()) {
        throw new Error('Not all players are ready or need at least 2 players');
      }

      // Create game from lobby
      const game = gameManager.createGame(lobby);
      lobby.gameStarted = true;
      
      // Send initial game state to each player
      lobby.players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('gameStarted', game.getStateForPlayer(player.id));
        }
      });
      
      callback({ success: true });
      console.log(`Game started in lobby: ${lobbyCode}`);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // ========================
  // GAME EVENTS
  // ========================

  socket.on('gameAction', ({ lobbyCode, action, target, card }, callback) => {
    try {
      // Update last activity
      const conn = activeConnections.get(socket.id);
      if (conn) {
        conn.lastActivity = Date.now();
      }
      
      const result = gameManager.handleAction(lobbyCode, socket.id, action, target, card);
      
      if (result.success) {
        // Broadcast updated state to all players
        const game = gameManager.getGame(lobbyCode);
        game.players.forEach(player => {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('gameStateUpdated', game.getStateForPlayer(player.id));
          }
        });
        
        // Check if game ended and schedule cleanup
        if (game.phase === 'gameOver') {
          gameManager.scheduleGameCleanup(lobbyCode);
        }
      }
      
      callback(result);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('challenge', ({ lobbyCode }, callback) => {
    try {
      const result = gameManager.handleChallenge(lobbyCode, socket.id);
      
      if (result.success) {
        const game = gameManager.getGame(lobbyCode);
        game.players.forEach(player => {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('gameStateUpdated', game.getStateForPlayer(player.id));
          }
        });
        
        // Check if game ended and schedule cleanup
        if (game.phase === 'gameOver') {
          gameManager.scheduleGameCleanup(lobbyCode);
        }
      }
      
      callback(result);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('block', ({ lobbyCode, claimedCard }, callback) => {
    try {
      const result = gameManager.handleBlock(lobbyCode, socket.id, claimedCard);
      
      if (result.success) {
        const game = gameManager.getGame(lobbyCode);
        game.players.forEach(player => {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('gameStateUpdated', game.getStateForPlayer(player.id));
          }
        });
      }
      
      callback(result);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('allowAction', ({ lobbyCode }, callback) => {
    try {
      const result = gameManager.handleAllow(lobbyCode, socket.id);
      
      if (result.success) {
        const game = gameManager.getGame(lobbyCode);
        game.players.forEach(player => {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('gameStateUpdated', game.getStateForPlayer(player.id));
          }
        });
      }
      
      callback(result);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('selectInfluenceToLose', ({ lobbyCode, cardIndex }, callback) => {
    try {
      const result = gameManager.handleInfluenceLoss(lobbyCode, socket.id, cardIndex);
      
      if (result.success) {
        const game = gameManager.getGame(lobbyCode);
        game.players.forEach(player => {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('gameStateUpdated', game.getStateForPlayer(player.id));
          }
        });
        
        // Check if game ended and schedule cleanup
        if (game.phase === 'gameOver') {
          gameManager.scheduleGameCleanup(lobbyCode);
        }
      }
      
      callback(result);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('exchangeCards', ({ lobbyCode, selectedCards }, callback) => {
    try {
      const result = gameManager.handleExchange(lobbyCode, socket.id, selectedCards);
      
      if (result.success) {
        const game = gameManager.getGame(lobbyCode);
        game.players.forEach(player => {
          const playerSocket = io.sockets.sockets.get(player.id);
          if (playerSocket) {
            playerSocket.emit('gameStateUpdated', game.getStateForPlayer(player.id));
          }
        });
      }
      
      callback(result);
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // ========================
  // CHAT EVENTS
  // ========================

  socket.on('sendMessage', ({ lobbyCode, message }) => {
    const lobby = lobbyManager.getLobby(lobbyCode);
    if (lobby) {
      const player = lobby.players.find(p => p.id === socket.id);
      if (player) {
        io.to(lobbyCode).emit('chatMessage', {
          playerName: player.name,
          message,
          timestamp: Date.now()
        });
      }
    }
  });

  // ========================
  // DISCONNECT HANDLING
  // ========================

  socket.on('disconnect', (reason) => {
    console.log(`Player disconnected: ${socket.id}, reason: ${reason}`);
    
    // Remove from active connections
    activeConnections.delete(socket.id);
    
    // Handle lobby disconnection
    const lobbyResult = lobbyManager.handleDisconnect(socket.id);
    if (lobbyResult.lobby) {
      io.to(lobbyResult.lobby.id).emit('lobbyUpdated', lobbyResult.lobby.getPublicState());
      io.to(lobbyResult.lobby.id).emit('playerDisconnected', { 
        playerName: lobbyResult.playerName 
      });
    }
    
    // Handle game disconnection
    gameManager.handleDisconnect(socket.id, (game) => {
      game.players.forEach(player => {
        const playerSocket = io.sockets.sockets.get(player.id);
        if (playerSocket) {
          playerSocket.emit('gameStateUpdated', game.getStateForPlayer(player.id));
        }
      });
    });
  });
  
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });
});

// Clean up stale connections every 2 minutes
setInterval(() => {
  const now = Date.now();
  const STALE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  
  for (const [socketId, conn] of activeConnections.entries()) {
    const inactiveTime = now - conn.lastActivity;
    if (inactiveTime > STALE_TIMEOUT) {
      console.log(`🧹 Removing stale connection: ${socketId}`);
      const staleSocket = io.sockets.sockets.get(socketId);
      if (staleSocket) {
        staleSocket.disconnect(true);
      }
      activeConnections.delete(socketId);
    }
  }
}, 2 * 60 * 1000);

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime(),
    connections: io.engine.clientsCount,
    lobbies: lobbyManager.lobbies.size,
    games: gameManager.games.size
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: Math.floor(process.uptime()),
    message: 'Server is alive'
  });
});

// Catch-all for SPA
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     ██████╗ ██████╗ ██╗   ██╗██████╗                      ║
║    ██╔════╝██╔═══██╗██║   ██║██╔══██╗                     ║
║    ██║     ██║   ██║██║   ██║██████╔╝                     ║
║    ██║     ██║   ██║██║   ██║██╔═══╝                      ║
║    ╚██████╗╚██████╔╝╚██████╔╝██║                          ║
║     ╚═════╝ ╚═════╝  ╚═════╝ ╚═╝                          ║
║                                                           ║
║     Server running on port ${PORT}                          ║
║     Ready for connections...                              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  
  // Keep-alive mechanism to prevent Render from sleeping
  if (process.env.NODE_ENV === 'production') {
    const KEEP_ALIVE_INTERVAL = 5 * 60 * 1000; // 5 minutes (Render spins down after 15 min)
    
    // Immediate self-ping on startup
    const performSelfPing = async () => {
      try {
        const timestamp = new Date().toISOString();
        console.log(`⏰ Keep-alive ping at ${timestamp}`);
        console.log(`📊 Active connections: ${io.engine.clientsCount}`);
        console.log(`🎮 Active lobbies: ${lobbyManager.lobbies.size}`);
        console.log(`🎯 Active games: ${gameManager.games.size}`);
        
        // Self-ping to keep the server awake
        const https = await import('https');
        const options = {
          hostname: 'coup-erky.onrender.com',
          path: '/health',
          method: 'GET',
          timeout: 5000
        };
        
        const req = https.request(options, (res) => {
          console.log(`✅ Self-ping successful: ${res.statusCode}`);
        });
        
        req.on('error', (error) => {
          console.error(`⚠️ Self-ping failed:`, error.message);
        });
        
        req.on('timeout', () => {
          req.destroy();
          console.error(`⚠️ Self-ping timeout`);
        });
        
        req.end();
      } catch (error) {
        console.error('❌ Keep-alive error:', error.message);
      }
    };
    
    // Initial ping
    setTimeout(performSelfPing, 10000); // Wait 10 seconds after startup
    
    // Regular interval pings
    setInterval(performSelfPing, KEEP_ALIVE_INTERVAL);
    
    console.log('🔄 Keep-alive mechanism enabled (5 min intervals)');
    console.log('⏰ Server will ping itself every 5 minutes to prevent sleep');
  }
});
