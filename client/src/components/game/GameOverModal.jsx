import { motion } from 'framer-motion'
import { Trophy, Home, RotateCcw, Crown } from 'lucide-react'
import confetti from '../../utils/confetti'
import { useEffect } from 'react'

export default function GameOverModal({ winner, myId, onLeave }) {
  const isWinner = winner?.id === myId

  useEffect(() => {
    if (isWinner) {
      // Trigger confetti for winner
      confetti()
    }
  }, [isWinner])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-full max-w-lg text-center"
      >
        {/* Trophy animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 10 }}
          className="mb-8"
        >
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center ${
            isWinner 
              ? 'bg-gradient-to-br from-coup-gold to-coup-gold-dark shadow-coup' 
              : 'bg-coup-gray border-2 border-coup-gray-light'
          }`}>
            {isWinner ? (
              <Trophy className="w-16 h-16 text-coup-dark" />
            ) : (
              <Crown className="w-16 h-16 text-coup-gold" />
            )}
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isWinner ? (
            <>
              <h1 className="font-display text-5xl text-coup-gold mb-4">
                VICTORY!
              </h1>
              <p className="text-gray-300 text-lg mb-2">
                You have eliminated all opposition
              </p>
              <p className="text-coup-gold font-display text-xl">
                The throne is yours!
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-4xl text-white mb-4">
                Game Over
              </h1>
              <p className="text-gray-400 text-lg mb-2">
                The winner is
              </p>
              <p className="text-coup-gold font-display text-3xl">
                {winner?.name}
              </p>
            </>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onLeave}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return to Lobby
          </button>
        </motion.div>

        {/* Decorative elements */}
        {isWinner && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.8 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Gold particles/stars effect would go here */}
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
