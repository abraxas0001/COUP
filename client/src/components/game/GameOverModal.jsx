import { motion } from 'framer-motion'
import { Home, Crown } from 'lucide-react'
import confetti from '../../utils/confetti'
import { useEffect, useState } from 'react'
import { AVATAR_IMAGES } from '../Avatar'

export default function GameOverModal({ winner, myId, onLeave, players }) {
  const isWinner = winner?.id === myId
  const [showContent, setShowContent] = useState(false)

  // Find the winner in the players list to get the correct avatarId
  let winnerAvatarId = winner?.avatarId
  if (players && winner) {
    const found = players.find(
      p => p.id === winner.id || p.name === winner.name
    )
    if (found && found.avatarId) winnerAvatarId = found.avatarId
  }
  const winnerAvatarPath = AVATAR_IMAGES[winnerAvatarId] || AVATAR_IMAGES[1]

  useEffect(() => {
    // Trigger confetti for everyone (but more for the winner)
    if (isWinner) {
      confetti()
      setTimeout(() => confetti(), 500)
      setTimeout(() => confetti(), 1000)
    } else {
      setTimeout(() => confetti(), 800)
    }
    setTimeout(() => setShowContent(true), 300)
  }, [isWinner])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 100 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="w-full max-w-lg text-center relative z-10"
      >
        {/* Winner Avatar with simple highlight and crown */}
        <div className="relative flex flex-col items-center mb-8">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-coup-gold shadow-2xl bg-coup-dark">
            <img 
              src={winnerAvatarPath}
              alt={winner?.name || 'Winner'}
              className="w-full h-full object-cover"
            />
            {/* Crown on top */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
              <Crown className="w-14 h-14 text-coup-gold drop-shadow-lg" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Message */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {isWinner ? (
              <>
                <h1 className="font-display text-6xl text-coup-gold mb-4">
                  VICTORY!
                </h1>
                <p className="text-gray-300 text-lg mb-2">
                  You have eliminated all opposition
                </p>
                <p className="text-coup-gold font-display text-2xl">
                  👑 The throne is yours! 👑
                </p>
              </>
            ) : (
              <>
                <h1 className="font-display text-5xl text-white mb-4">
                  Game Over
                </h1>
                <p className="text-gray-400 text-lg mb-2">
                  The winner is
                </p>
                <p className="text-coup-gold font-display text-4xl">
                  {winner?.name}
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Better luck next time!
                </p>
              </>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-10"
        >
          <motion.button
            onClick={onLeave}
            className="btn-primary flex items-center justify-center gap-2 mx-auto px-8 py-3 text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            Return to Lobby
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
