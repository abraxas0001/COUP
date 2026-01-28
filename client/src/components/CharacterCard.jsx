import { motion } from 'framer-motion'

// Card image paths
const CARD_IMAGES = {
  duke: '/cards/duke.png',
  assassin: '/cards/assassin.png',
  captain: '/cards/captain.png',
  ambassador: '/cards/ambassador.png',
  contessa: '/cards/contessa.png'
}

export default function CharacterCard({ 
  character, 
  isRevealed = true, 
  isExpanded = false, 
  showDetails = false, 
  size = 'medium',
  onClick,
  isSelected = false,
  isDisabled = false
}) {
  const sizes = {
    small: { container: 'w-20 h-28', text: 'text-xs' },
    medium: { container: 'w-32 h-44', text: 'text-sm' },
    large: { container: 'w-40 h-56', text: 'text-base' },
    xlarge: { container: 'w-48 h-64', text: 'text-lg' }
  }

  const currentSize = sizes[size] || sizes.medium
  const cardImage = CARD_IMAGES[character?.id]

  return (
    <motion.div
      layout
      onClick={!isDisabled ? onClick : undefined}
      whileHover={!isDisabled && onClick ? { scale: 1.05, y: -5 } : {}}
      whileTap={!isDisabled && onClick ? { scale: 0.98 } : {}}
      className={`
        relative rounded-xl overflow-hidden shadow-2xl
        ${currentSize.container}
        ${onClick && !isDisabled ? 'cursor-pointer' : ''}
        ${isDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        ${isSelected ? 'ring-4 ring-coup-gold ring-offset-2 ring-offset-coup-dark' : ''}
        transition-all duration-300
      `}
      style={{
        boxShadow: isSelected 
          ? '0 0 30px rgba(212, 175, 55, 0.5)' 
          : '0 10px 40px rgba(0, 0, 0, 0.5)'
      }}
    >
      {/* Card Image */}
      {isRevealed && cardImage ? (
        <img
          src={cardImage}
          alt={character.name}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
      ) : (
        /* Card Back */
        <div className="absolute inset-0 bg-gradient-to-br from-coup-dark via-coup-purple to-coup-dark">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-coup-gold/30 rounded-full flex items-center justify-center">
              <span className="text-coup-gold font-display text-2xl">?</span>
            </div>
          </div>
          {/* Ornate pattern for card back */}
          <div className="absolute inset-2 border border-coup-gold/20 rounded-lg" />
          <div className="absolute inset-4 border border-coup-gold/10 rounded-lg" />
        </div>
      )}

      {/* Shine effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />

      {/* Hover glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
      />

      {/* Selected checkmark */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 bg-coup-gold rounded-full p-1"
        >
          <svg className="w-4 h-4 text-coup-dark" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}

      {/* Dead card overlay */}
      {isDisabled && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-red-500 font-display text-lg transform -rotate-12">REVEALED</span>
        </div>
      )}
    </motion.div>
  )
}
