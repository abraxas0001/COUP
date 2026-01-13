import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, Check } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { CHARACTERS } from '../../constants/gameConstants'

// Card image paths
const CARD_IMAGES = {
  duke: '/cards/duke.svg',
  assassin: '/cards/assassin.svg',
  captain: '/cards/captain.svg',
  ambassador: '/cards/ambassador.svg',
  contessa: '/cards/contessa.svg'
}

export default function ExchangeModal({ exchangeOptions, onClose }) {
  const { exchangeCards } = useGameStore()
  const { handCards, drawnCards, mustSelect } = exchangeOptions
  
  const [selectedIndices, setSelectedIndices] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Combine all available cards
  const allCards = [...handCards, ...drawnCards]

  const handleCardClick = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index))
    } else if (selectedIndices.length < mustSelect) {
      setSelectedIndices([...selectedIndices, index])
    }
  }

  const handleConfirm = async () => {
    if (selectedIndices.length !== mustSelect) return
    
    setIsSubmitting(true)
    try {
      await exchangeCards(selectedIndices)
      onClose()
    } catch (err) {
      console.error('Exchange failed:', err)
    }
    setIsSubmitting(false)
  }

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
        className="w-full max-w-2xl glass border border-coup-gold/30 rounded-2xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <ArrowLeftRight className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="font-display text-xl text-coup-gold">Ambassador Exchange</h2>
            <p className="text-sm text-gray-400">
              Select {mustSelect} card{mustSelect > 1 ? 's' : ''} to keep
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mb-8">
          <div className="mb-4">
            <span className="text-sm text-gray-500 mb-2 block">Your current cards:</span>
            <div className="flex gap-4 flex-wrap">
              {handCards.map((card, index) => (
                <CardOption
                  key={`hand-${index}`}
                  card={card}
                  isSelected={selectedIndices.includes(index)}
                  onClick={() => handleCardClick(index)}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-coup-gray-light my-6" />

          <div>
            <span className="text-sm text-gray-500 mb-2 block">Cards from the Court Deck:</span>
            <div className="flex gap-4 flex-wrap">
              {drawnCards.map((card, index) => (
                <CardOption
                  key={`drawn-${index}`}
                  card={card}
                  isSelected={selectedIndices.includes(handCards.length + index)}
                  onClick={() => handleCardClick(handCards.length + index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selection count */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-gray-400">
            Selected: <span className={`font-bold ${selectedIndices.length === mustSelect ? 'text-green-400' : 'text-coup-gold'}`}>
              {selectedIndices.length}
            </span> / {mustSelect}
          </span>
          
          <p className="text-sm text-gray-500">
            The remaining cards will be returned to the Court Deck
          </p>
        </div>

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={selectedIndices.length !== mustSelect || isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-coup-dark/30 border-t-coup-dark rounded-full animate-spin" />
              Exchanging...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Confirm Selection
            </>
          )}
        </button>
      </motion.div>
    </motion.div>
  )
}

function CardOption({ card, isSelected, onClick }) {
  const charInfo = CHARACTERS[card]
  const cardImage = CARD_IMAGES[card]

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative w-32 h-44 rounded-xl overflow-hidden transition-all
        ${isSelected 
          ? 'ring-4 ring-green-400 shadow-2xl' 
          : 'ring-2 ring-white/20 hover:ring-coup-gold/50'
        }`}
      style={{
        boxShadow: isSelected 
          ? '0 10px 40px rgba(74, 222, 128, 0.3)' 
          : '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Card Image */}
      <img
        src={cardImage}
        alt={charInfo?.name}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      {/* Selected indicator */}
      {isSelected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-5 h-5 text-white" />
        </motion.div>
      )}

      {/* Selection border glow */}
      {isSelected && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 border-4 border-green-400 rounded-xl pointer-events-none"
        />
      )}
    </motion.button>
  )
}
