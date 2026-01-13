import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { CHARACTERS } from '../../constants/gameConstants'

// Card image paths
const CARD_IMAGES = {
  duke: '/cards/duke.svg',
  assassin: '/cards/assassin.svg',
  captain: '/cards/captain.svg',
  ambassador: '/cards/ambassador.svg',
  contessa: '/cards/contessa.svg'
}

export default function PlayerHand({ player, isMyTurn }) {
  if (!player) return null

  return (
    <div className="flex items-center gap-6">
      {/* Coins */}
      <div className="text-center">
        <div className="flex items-center gap-2 mb-1">
          <Coins className="w-6 h-6 text-coup-gold" />
          <span className="text-2xl font-bold text-coup-gold">{player.coins}</span>
        </div>
        <p className="text-xs text-gray-500">Coins</p>
      </div>

      {/* Divider */}
      <div className="w-px h-16 bg-coup-gray-light" />

      {/* Cards */}
      <div className="flex gap-4 perspective-1000">
        {player.influence?.map((card, index) => (
          <InfluenceCard
            key={index}
            card={card}
            index={index}
            isMyTurn={isMyTurn}
          />
        ))}
      </div>

      {/* Turn indicator */}
      {isMyTurn && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-4 px-4 py-2 bg-coup-gold text-coup-dark font-display font-bold rounded-lg"
        >
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            YOUR TURN
          </motion.span>
        </motion.div>
      )}
    </div>
  )
}

function InfluenceCard({ card, index, isMyTurn }) {
  const charInfo = CHARACTERS[card.card]
  const cardImage = CARD_IMAGES[card.card]

  if (card.revealed) {
    // Revealed/Dead card
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 0.95 }}
        className="relative w-28 h-40 rounded-xl overflow-hidden"
        style={{ 
          filter: 'grayscale(70%) brightness(0.5)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}
      >
        <img
          src={cardImage}
          alt={charInfo?.name}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Dead overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-red-900/80 px-3 py-1 rounded transform -rotate-12">
            <span className="text-red-300 font-display text-sm tracking-wider">REVEALED</span>
          </div>
        </div>
      </motion.div>
    )

  }

  // Active card with image
  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.05, rotateZ: index === 0 ? -3 : 3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="relative w-28 h-40 rounded-xl overflow-hidden cursor-pointer group"
      style={{
        boxShadow: isMyTurn 
          ? '0 8px 30px rgba(212, 175, 55, 0.4), 0 0 60px rgba(212, 175, 55, 0.2)'
          : '0 8px 30px rgba(0, 0, 0, 0.4)',
        transform: `rotate(${index === 0 ? -2 : 2}deg)`
      }}
    >
      {/* Card Image */}
      <img
        src={cardImage}
        alt={charInfo?.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        draggable={false}
      />

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.3)',
          opacity: 0
        }}
        whileHover={{ opacity: 1 }}
      />

      {/* Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/10 group-hover:border-coup-gold/50 transition-colors pointer-events-none" />

      {/* Turn glow effect */}
      {isMyTurn && (
        <motion.div
          animate={{ 
            boxShadow: [
              'inset 0 0 20px rgba(212, 175, 55, 0.2)',
              'inset 0 0 40px rgba(212, 175, 55, 0.4)',
              'inset 0 0 20px rgba(212, 175, 55, 0.2)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-xl pointer-events-none"
        />
      )}
    </motion.div>
  )
}
