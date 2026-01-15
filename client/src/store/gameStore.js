import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://coup-erky.onrender.com'

console.log('🔌 Connecting to Socket.io at:', SOCKET_URL)
console.log('🌍 Environment:', import.meta.env.MODE)
console.log('🔧 API URL from env:', import.meta.env.VITE_API_URL)

export const useGameStore = create((set, get) => ({
  // Socket connection
  socket: null,
  isConnected: false,
  
  // Player info
  playerName: localStorage.getItem('playerName') || '',
  avatarId: parseInt(localStorage.getItem('avatarId')) || 1,
  
  // Lobby state
  lobby: null,
  
  // Game state
  gameState: null,
  
  // UI state
  error: null,
  isLoading: false,
  
  // Initialize socket connection
  initializeSocket: () => {
    const existingSocket = get().socket
    
    // If socket exists and is connected, reuse it
    if (existingSocket?.connected) {
      console.log('♻️ Reusing existing socket connection')
      return
    }
    
    // If socket exists but disconnected, clean it up
    if (existingSocket) {
      console.log('🧹 Cleaning up old socket connection')
      // Clear heartbeat interval
      if (existingSocket._heartbeatInterval) {
        clearInterval(existingSocket._heartbeatInterval)
        existingSocket._heartbeatInterval = null
      }
      existingSocket.removeAllListeners()
      existingSocket.close()
      existingSocket.disconnect()
    }
    
    // Show loading state while connecting
    set({ isLoading: true, error: 'Connecting to server...' })
    
    // Test server connectivity first (non-blocking with timeout)
    console.log('🔍 Testing server connectivity...')
    const healthCheckTimeout = setTimeout(() => {
      console.log('⏱️ Health check timed out, proceeding with connection...')
    }, 5000)
    
    fetch(`${SOCKET_URL}/health`, { 
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
      .then(res => res.json())
      .then(data => {
        clearTimeout(healthCheckTimeout)
        console.log('✅ Server is reachable:', data)
      })
      .catch(err => {
        clearTimeout(healthCheckTimeout)
        console.warn('⚠️ Health check failed (server might be waking up):', err.message)
      })
    
    const socket = io(SOCKET_URL, {
      transports: ['polling', 'websocket'], // Polling first for reliability
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 60000,
      autoConnect: true,
      forceNew: false,
      upgrade: true, // Try to upgrade to websocket after polling connects
      rememberUpgrade: true,
      closeOnBeforeunload: false,
      secure: true, // Use secure connection
      rejectUnauthorized: false, // Accept self-signed certs in dev
      withCredentials: true,
      path: '/socket.io/',
    })
    
    socket.on('connect', () => {
      console.log('✅ Connected to server')
      set({ isConnected: true, error: null, isLoading: false })
      
      // Start heartbeat to keep server awake
      const heartbeatInterval = setInterval(() => {
        if (socket.connected) {
          socket.emit('ping', { timestamp: Date.now() })
        } else {
          clearInterval(heartbeatInterval)
        }
      }, 5 * 60 * 1000) // Send heartbeat every 5 minutes
      
      // Store interval ID for cleanup
      socket._heartbeatInterval = heartbeatInterval
    })
    
    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason)
      set({ isConnected: false })
      
      // Clear heartbeat interval
      if (socket._heartbeatInterval) {
        clearInterval(socket._heartbeatInterval)
        socket._heartbeatInterval = null
      }
      
      if (reason === 'io server disconnect') {
        set({ error: 'Server disconnected. Attempting to reconnect...' })
        setTimeout(() => {
          socket.connect()
        }, 3000)
      }
    })
    
    socket.on('pong', () => {
      console.log('💓 Server heartbeat received')
    })
    
    socket.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error)
      const attemptNumber = socket.io?.engine?.transport?.name
      set({ 
        error: `Connecting to server... ${attemptNumber ? `(${attemptNumber})` : ''}`,
        isLoading: true 
      })
    })
    
    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`🔄 Reconnection attempt ${attemptNumber}`)
      set({ error: `Reconnecting... (Attempt ${attemptNumber})` })
    })
    
    socket.on('reconnect', (attemptNumber) => {
      console.log(`✅ Reconnected after ${attemptNumber} attempts`)
      set({ error: null, isLoading: false })
    })
    
    socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed')
      set({ 
        error: 'Unable to connect to server. Please check your internet connection and try again.',
        isLoading: false 
      })
    })
    
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error)
      set({ error: 'Connection error. Server may be restarting. Please wait...' })
    })
    
    // Lobby events
    socket.on('lobbyUpdated', (lobby) => {
      set({ lobby })
    })
    
    socket.on('playerDisconnected', ({ playerName }) => {
      console.log(`${playerName} disconnected`)
    })
    
    // Game events
    socket.on('gameStarted', (gameState) => {
      set({ gameState })
    })
    
    socket.on('gameStateUpdated', (gameState) => {
      set({ gameState })
    })
    
    socket.on('chatMessage', (message) => {
      // Handle chat messages
      console.log('Chat:', message)
    })
    
    set({ socket })
  },
  
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      console.log('🔌 Disconnecting socket')
      
      // Clear heartbeat interval
      if (socket._heartbeatInterval) {
        clearInterval(socket._heartbeatInterval)
        socket._heartbeatInterval = null
      }
      
      socket.removeAllListeners()
      socket.close()
      socket.disconnect()
      set({ socket: null, isConnected: false, lobby: null, gameState: null })
    }
  },
  
  setPlayerName: (name) => {
    localStorage.setItem('playerName', name)
    set({ playerName: name })
  },
  
  setAvatarId: (id) => {
    localStorage.setItem('avatarId', id.toString())
    set({ avatarId: id })
  },
  
  // Lobby actions
  createLobby: () => {
    return new Promise((resolve, reject) => {
      const { socket, playerName, avatarId } = get()
      if (!socket) {
        console.error('❌ Cannot create lobby: No socket connection')
        return reject(new Error('Not connected'))
      }
      
      console.log('📤 Creating lobby...', { playerName, avatarId })
      set({ isLoading: true, error: null })
      
      socket.emit('createLobby', { playerName, avatarId }, (response) => {
        console.log('📥 Create lobby response:', response)
        set({ isLoading: false })
        if (response.success) {
          console.log('✅ Lobby created:', response.lobby)
          set({ lobby: response.lobby })
          resolve(response.lobby)
        } else {
          console.error('❌ Create lobby failed:', response.error)
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  joinLobby: (lobbyCode) => {
    return new Promise((resolve, reject) => {
      const { socket, playerName, avatarId } = get()
      if (!socket) {
        console.error('❌ Cannot join lobby: No socket connection')
        return reject(new Error('Not connected'))
      }
      
      console.log('📤 Joining lobby...', { lobbyCode, playerName, avatarId })
      set({ isLoading: true, error: null })
      
      socket.emit('joinLobby', { lobbyCode, playerName, avatarId }, (response) => {
        console.log('📥 Join lobby response:', response)
        set({ isLoading: false })
        if (response.success) {
          console.log('✅ Joined lobby:', response.lobby)
          set({ lobby: response.lobby })
          resolve(response.lobby)
        } else {
          console.error('❌ Join lobby failed:', response.error)
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  leaveLobby: () => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) {
        // Clear state even if no lobby
        set({ lobby: null, gameState: null, error: null })
        return resolve()
      }
      
      console.log('📤 Leaving lobby...')
      
      socket.emit('leaveLobby', { lobbyCode: lobby.id }, (response) => {
        if (response.success) {
          console.log('✅ Left lobby successfully')
          set({ lobby: null, gameState: null, error: null })
          resolve()
        } else {
          console.warn('⚠️ Leave lobby response:', response.error)
          // Clear state anyway
          set({ lobby: null, gameState: null, error: null })
          resolve() // Don't reject, just resolve
        }
      })
      
      // Timeout fallback
      setTimeout(() => {
        set({ lobby: null, gameState: null, error: null })
        resolve()
      }, 2000)
    })
  },
  
  toggleReady: () => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a lobby'))
      
      socket.emit('toggleReady', { lobbyCode: lobby.id }, (response) => {
        if (response.success) {
          resolve()
        } else {
          reject(new Error(response.error))
        }
      })
    })
  },
  
  startGame: () => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a lobby'))
      
      set({ isLoading: true, error: null })
      
      socket.emit('startGame', { lobbyCode: lobby.id }, (response) => {
        set({ isLoading: false })
        if (response.success) {
          resolve()
        } else {
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  // Game actions
  performAction: (action, targetId = null) => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a game'))
      
      socket.emit('gameAction', { 
        lobbyCode: lobby.id, 
        action, 
        target: targetId 
      }, (response) => {
        if (response.success) {
          resolve()
        } else {
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  challenge: () => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a game'))
      
      socket.emit('challenge', { lobbyCode: lobby.id }, (response) => {
        if (response.success) {
          resolve()
        } else {
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  block: (claimedCard) => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a game'))
      
      socket.emit('block', { lobbyCode: lobby.id, claimedCard }, (response) => {
        if (response.success) {
          resolve()
        } else {
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  allowAction: () => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a game'))
      
      socket.emit('allowAction', { lobbyCode: lobby.id }, (response) => {
        if (response.success) {
          resolve()
        } else {
          reject(new Error(response.error))
        }
      })
    })
  },
  
  selectInfluenceToLose: (cardIndex) => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a game'))
      
      socket.emit('selectInfluenceToLose', { 
        lobbyCode: lobby.id, 
        cardIndex 
      }, (response) => {
        if (response.success) {
          resolve()
        } else {
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  exchangeCards: (selectedIndices) => {
    return new Promise((resolve, reject) => {
      const { socket, lobby } = get()
      if (!socket || !lobby) return reject(new Error('Not in a game'))
      
      socket.emit('exchangeCards', { 
        lobbyCode: lobby.id, 
        selectedCards: selectedIndices 
      }, (response) => {
        if (response.success) {
          resolve()
        } else {
          set({ error: response.error })
          reject(new Error(response.error))
        }
      })
    })
  },
  
  clearError: () => set({ error: null }),
  
  resetGame: async () => {
    const { socket, lobby } = get()
    
    // Try to leave lobby if in one
    if (socket && lobby) {
      try {
        socket.emit('leaveLobby', { lobbyCode: lobby.id }, () => {
          console.log('✅ Left lobby')
        })
      } catch (err) {
        console.warn('Failed to leave lobby:', err)
      }
    }
    
    // Clear state
    set({ gameState: null, lobby: null, error: null, isLoading: false })
  },
}))
