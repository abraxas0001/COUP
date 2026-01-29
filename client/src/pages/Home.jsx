import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Crown, Users, BookOpen, Sparkles, ChevronRight } from 'lucide-react'
import { useGameStore } from '../store/gameStore'
import Logo from '../components/Logo'
import AvatarSelector from '../components/AvatarSelector'
import Modal from '../components/Modal'
import { AVATAR_NAMES } from '../components/Avatar'

// Keep reference to avatar names for checking
const avatarNames = AVATAR_NAMES

export default function Home() {
  const navigate = useNavigate()
  const { 
    playerName, 
    setPlayerName, 
    avatarId,
    setAvatarId,
    createLobby, 
    joinLobby,
    isConnected,
    isLoading,
    error,
    clearError
  } = useGameStore()
  
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [lobbyCode, setLobbyCode] = useState('')
  const [tempName, setTempName] = useState(playerName)
  
  // Check for pending lobby code (from direct link redirect)
  useEffect(() => {
    const pendingLobbyCode = localStorage.getItem('pendingLobbyCode')
    if (pendingLobbyCode) {
      setLobbyCode(pendingLobbyCode)
      setShowJoinModal(true)
      // Do NOT auto-join, just show the modal for avatar/name selection
      localStorage.removeItem('pendingLobbyCode')
    }
  }, [])

  const handleCreateLobby = async () => {
    if (!tempName.trim()) return
    setPlayerName(tempName.trim())
    
    try {
      const lobby = await createLobby()
      navigate(`/lobby/${lobby.id}`)
    } catch (err) {
      console.error('Failed to create lobby:', err)
    }
  }

  const handleJoinLobby = async () => {
    if (!tempName.trim() || !lobbyCode.trim()) return
    setPlayerName(tempName.trim())
    
    try {
      await joinLobby(lobbyCode.trim().toUpperCase())
      navigate(`/lobby/${lobbyCode.trim().toUpperCase()}`)
    } catch (err) {
      console.error('Failed to join lobby:', err)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      style={{
        backgroundImage: 'url(/images/Screenshot%202026-01-14%20092824.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 pointer-events-none" style={{ zIndex: 0 }} />
      
      {/* Content wrapper with higher z-index */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <Logo size="large" />
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-300 text-lg mt-6 max-w-md mx-auto drop-shadow-lg"
        >
          The ultimate game of bluff and deception. 
          Manipulate, deceive, and eliminate your way to power.
        </motion.p>
      </motion.div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        {isConnected ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-green-500/10 text-green-400 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Connected to server
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Waking up server...
            </div>
            <p className="text-xs text-gray-400 text-center max-w-xs drop-shadow-md">
              {error || 'Free hosting spins down after inactivity. First connection may take 60-90 seconds.'}
            </p>
            <button
              onClick={() => {
                const { socket } = useGameStore.getState()
                if (socket) {
                  socket.connect()
                }
              }}
              className="text-xs px-3 py-1 border border-coup-gold/40 text-coup-gold/70 hover:text-coup-gold hover:border-coup-gold/70 rounded-lg transition-colors"
            >
              Retry Connection
            </button>
          </div>
        )}
      </motion.div>

      {/* Main Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!isConnected}
          className="btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Crown className="w-5 h-5" />
          Create Party
          <Sparkles className="w-4 h-4" />
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          disabled={!isConnected}
          className="btn-secondary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Users className="w-5 h-5" />
          Join Party
        </button>

        <Link
          to="/how-to-play"
          className="btn-secondary flex items-center justify-center gap-3 mt-4"
        >
          <BookOpen className="w-5 h-5" />
          How to Play
          <ChevronRight className="w-4 h-4" />
        </Link>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
      >
        {[
          { icon: Users, title: '2-6 Players', desc: 'Play with friends online' },
          { icon: Crown, title: 'Bluff & Deceive', desc: 'Lie your way to victory' },
          { icon: Sparkles, title: 'Real-time', desc: 'Instant multiplayer action' },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="glass border border-coup-gold/20 rounded-xl p-6 text-center backdrop-blur-md"
          >
            <feature.icon className="w-8 h-8 text-coup-gold mx-auto mb-3" />
            <h3 className="font-display text-coup-gold mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Create Party Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false)
          clearError()
        }}
        title="Create a Party"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Your Name</label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter your name..."
              className="input-primary"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Choose Your Avatar</label>
            <AvatarSelector
              selectedId={avatarId}
              onSelect={(id, name) => {
                setAvatarId(id)
                setTempName(name)
              }}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateLobby}
            disabled={!tempName.trim() || isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-coup-dark/30 border-t-coup-dark rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Crown className="w-5 h-5" />
                Create Party
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Join Party Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false)
          clearError()
          setLobbyCode('')
        }}
        title="Join a Party"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Your Name</label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter your name..."
              className="input-primary"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Party Code</label>
            <input
              type="text"
              value={lobbyCode}
              onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code..."
              className="input-primary text-center font-display text-xl tracking-widest"
              maxLength={6}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Choose Your Avatar</label>
            <AvatarSelector
              selectedId={avatarId}
              onSelect={(id, name) => {
                setAvatarId(id)
                setTempName(name)
              }}
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            onClick={handleJoinLobby}
            disabled={!tempName.trim() || !lobbyCode.trim() || lobbyCode.length !== 6 || isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-coup-dark/30 border-t-coup-dark rounded-full animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Users className="w-5 h-5" />
                Join Party
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-16 text-center text-gray-400 text-sm drop-shadow-md"
      >
        <p>A digital adaptation of the card game COUP</p>
      </motion.footer>
      
      </div>
    </div>
  )
}
