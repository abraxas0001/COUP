import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://coup-erky.onrender.com'

console.log('🔌 Connecting to Socket.io at:', SOCKET_URL)

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
    if (get().socket) return
    
    // Show loading state while connecting
    set({ isLoading: true, error: 'Waking up server... This may take 60-90 seconds on first load.' })
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 50, // Increased reconnection attempts
      reconnectionDelay: 1000, // Start with 1 second
      reconnectionDelayMax: 30000, // Up to 30 seconds between attempts
      timeout: 120000, // 120 second timeout for Render cold starts
      autoConnect: true,
      forceNew: false,
      multiplex: false,
    })
    
    socket.on('connect', () => {
      console.log('✅ Connected to server')
      set({ isConnected: true, error: null, isLoading: false })
    })
    
    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason)
      set({ isConnected: false })
      if (reason === 'io server disconnect') {
        set({ error: 'Server disconnected. Attempting to reconnect...' })
        setTimeout(() => {
          socket.connect()
        }, 3000)
      }
    })
    
    socket.on('connect_error', (error) => {
      console.error('⚠️ Connection error:', error)
      set({ error: `Connecting to server... (Attempt in progress)` })
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
      socket.disconnect()
      set({ socket: null, isConnected: false })
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
      if (!socket || !lobby) return resolve()
      
      socket.emit('leaveLobby', { lobbyCode: lobby.id }, (response) => {
        if (response.success) {
          set({ lobby: null })
          resolve()
        } else {
          reject(new Error(response.error))
        }
      })
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
  
  resetGame: () => set({ gameState: null, lobby: null }),
}))
