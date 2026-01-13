import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Copy, 
  Check, 
  Crown, 
  Users, 
  Play, 
  LogOut,
  User,
  Loader2
} from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import Logo from '../components/Logo'
import Avatar from '../components/Avatar'

export default function Lobby() {
  const { lobbyCode } = useParams()
  const navigate = useNavigate()
  const { 
    lobby, 
    gameState,
    playerName,
    toggleReady, 
    startGame, 
    leaveLobby,
    socket,
    isLoading,
    error
  } = useGameStore()
  
  const [copied, setCopied] = useState(false)
  const [starting, setStarting] = useState(false)

  // Redirect to game when it starts
  useEffect(() => {
    if (gameState) {
      navigate(`/game/${lobbyCode}`)
    }
  }, [gameState, lobbyCode, navigate])

  // Handle copy to clipboard
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(lobbyCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Handle leave lobby
  const handleLeave = async () => {
    await leaveLobby()
    navigate('/')
  }

  // Handle start game
  const handleStartGame = async () => {
    setStarting(true)
    try {
      await startGame()
    } catch (err) {
      setStarting(false)
    }
  }

  // Get current player
  const currentPlayer = lobby?.players.find(p => p.id === socket?.id)
  const isHost = currentPlayer?.isHost

  if (!lobby) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-coup-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading lobby...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Logo size="medium" />
      </motion.div>

      {/* Lobby Code Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl glass border border-coup-gold/30 rounded-2xl p-8 mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-gray-400 text-sm mb-2">Party Code</h2>
          <div className="flex items-center justify-center gap-4">
            <span className="font-display text-5xl text-coup-gold tracking-[0.3em]">
              {lobbyCode}
            </span>
            <button
              onClick={copyCode}
              className="p-3 bg-coup-gray rounded-lg hover:bg-coup-gray-light transition-colors"
              title="Copy code"
            >
              {copied ? (
                <Check className="w-6 h-6 text-green-400" />
              ) : (
                <Copy className="w-6 h-6 text-gray-400" />
              )}
            </button>
          </div>
          <p className="text-gray-500 text-sm mt-2">
            Share this code with friends to join
          </p>
        </div>

        {/* Player List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-coup-gold flex items-center gap-2">
              <Users className="w-5 h-5" />
              Players ({lobby.playerCount}/{lobby.maxPlayers})
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {lobby.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    player.isReady
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-coup-gray-light bg-coup-gray'
                  } ${player.id === socket?.id ? 'ring-2 ring-coup-gold/50' : ''}`}
                >
                  {/* Host Crown */}
                  {player.isHost && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Crown className="w-6 h-6 text-coup-gold fill-coup-gold/20" />
                    </div>
                  )}

                  <div className="flex flex-col items-center">
                    <Avatar id={player.avatarId} size="medium" />
                    <p className="mt-2 font-medium truncate max-w-full">
                      {player.name}
                      {player.id === socket?.id && (
                        <span className="text-coup-gold text-xs ml-1">(You)</span>
                      )}
                    </p>
                    <span className={`text-xs mt-1 ${
                      player.isReady ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {player.isHost ? 'Host' : player.isReady ? 'Ready' : 'Not Ready'}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: lobby.maxPlayers - lobby.playerCount }).map((_, i) => (
                <motion.div
                  key={`empty-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-xl border-2 border-dashed border-coup-gray-light bg-coup-gray/30"
                >
                  <div className="flex flex-col items-center text-gray-600">
                    <User className="w-12 h-12 mb-2" />
                    <p className="text-sm">Waiting...</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!isHost && (
            <button
              onClick={toggleReady}
              className={`flex-1 sm:flex-none px-8 py-3 rounded-lg font-display font-medium transition-all ${
                currentPlayer?.isReady
                  ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 hover:bg-green-500/30'
                  : 'bg-coup-gray text-gray-300 border-2 border-coup-gray-light hover:border-green-500/50'
              }`}
            >
              {currentPlayer?.isReady ? '✓ Ready' : 'Ready Up'}
            </button>
          )}

          {isHost && (
            <button
              onClick={handleStartGame}
              disabled={!lobby.canStart || starting}
              className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Game
                </>
              )}
            </button>
          )}

          <button
            onClick={handleLeave}
            className="btn-danger flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Leave
          </button>
        </div>

        {/* Start Requirements */}
        {isHost && !lobby.canStart && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-yellow-400/80 text-sm mt-4"
          >
            {lobby.playerCount < 2
              ? 'Need at least 2 players to start'
              : 'Waiting for all players to ready up'}
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-red-400 text-sm mt-4"
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 text-sm max-w-md"
      >
        <p>
          Share the party code with your friends. Once everyone is ready, 
          the host can start the game.
        </p>
      </motion.div>
    </div>
  )
}
