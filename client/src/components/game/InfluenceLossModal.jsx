import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { CHARACTERS } from '../../constants/gameConstants'

// Card image paths
const CARD_IMAGES = {
  duke: '/cards/duke.png',
  assassin: '/cards/assassin.png',
  captain: '/cards/captain.png',
  ambassador: '/cards/ambassador.png',
  contessa: '/cards/contessa.png'
}

export default function InfluenceLossModal({ player, onClose }) {
  const { selectInfluenceToLose } = useGameStore()

  const handleSelectCard = async (index) => {
    try {
      await selectInfluenceToLose(index)
      onClose()
    } catch (err) {
      console.error('Failed to select influence:', err)
    }
  }

  // Get unrevealed cards
  const unrevealedCards = player.influence
    ?.map((card, index) => ({ ...card, index }))
    .filter(card => !card.revealed)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg glass border border-red-500/30 rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="font-display text-xl text-red-400">Lose Influence</h2>
            <p className="text-sm text-gray-400">
              Choose which card to reveal
            </p>
          </div>
        </div>

        {/* Explanation */}
        <p className="text-gray-400 mb-6">
          You must lose one influence. Select a card to reveal. 
          This card will be placed face-up and can no longer be used.
        </p>

        {/* Cards */}
        <div className="flex justify-center gap-6 mb-6">
          {unrevealedCards?.map((card) => {
            const charInfo = CHARACTERS[card.card]
            const cardImage = CARD_IMAGES[card.card]

            return (
              <motion.button
                key={card.index}
                whileHover={{ scale: 1.08, y: -10 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectCard(card.index)}
                className="relative w-32 h-44 rounded-xl overflow-hidden
                  ring-2 ring-white/20 hover:ring-red-400 transition-all cursor-pointer group"
                style={{
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Card Image */}
                <img
                  src={cardImage}
                  alt={charInfo?.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                  draggable={false}
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/30 transition-colors flex items-center justify-center">
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    className="text-white font-display text-lg bg-red-600/80 px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    REVEAL
                  </motion.span>
                </div>

                {/* Danger border on hover */}
                <div className="absolute inset-0 border-4 border-transparent group-hover:border-red-400 rounded-xl transition-colors pointer-events-none" />
              </motion.button>
            )
          })}
        </div>

        {/* Warning */}
        <div className="text-center text-sm text-gray-500">
          <p>⚠️ This action cannot be undone</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
