import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Sparkles, Crown, X, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
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
  const [prevCoins, setPrevCoins] = useState(player?.coins || 0)
  const [coinChange, setCoinChange] = useState(0)
  const [showCoinChange, setShowCoinChange] = useState(false)
  
  useEffect(() => {
    if (player && player.coins !== prevCoins) {
      const diff = player.coins - prevCoins
      setCoinChange(diff)
      setShowCoinChange(true)
      setPrevCoins(player.coins)
      
      setTimeout(() => setShowCoinChange(false), 1500)
    }
  }, [player?.coins, prevCoins])

  if (!player) return null

  return (
    <div className="flex items-center gap-6">
      {/* Enhanced Coins Display */}
      <div className="relative">
        <motion.div 
          className="flex flex-col items-center p-4 bg-gradient-to-b from-coup-gray-light/50 to-coup-darker/50 
            rounded-2xl border border-coup-gold/20 backdrop-blur-sm"
          animate={showCoinChange ? { scale: [1, 1.05, 1] } : {}}
        >
          {/* Coin icon with stack effect */}
          <div className="relative mb-2">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-coup-gold via-coup-gold-light to-coup-gold-dark
                flex items-center justify-center shadow-lg relative"
            >
              <Coins className="w-6 h-6 text-coup-dark" />
              {/* Shine overlay */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 via-transparent to-transparent" />
            </motion.div>
            
            {/* Stack shadows */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full 
              bg-coup-gold-dark/30 blur-sm -z-10" />
          </div>
          
          {/* Coin count */}
          <div className="relative">
            <motion.span 
              key={player.coins}
              initial={{ scale: 1.2, color: coinChange > 0 ? '#4ade80' : '#f87171' }}
              animate={{ scale: 1, color: '#D4AF37' }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-coup-gold font-display"
            >
              {player.coins}
            </motion.span>
            
            {/* Coin change popup */}
            <AnimatePresence>
              {showCoinChange && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.5 }}
                  animate={{ opacity: 1, y: -30, scale: 1 }}
                  exit={{ opacity: 0, y: -50 }}
                  className={`absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded-full text-sm font-bold
                    ${coinChange > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                >
                  {coinChange > 0 ? '+' : ''}{coinChange}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">Treasury</p>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="w-px h-20 bg-gradient-to-b from-transparent via-coup-gold/30 to-transparent" />

      {/* Cards */}
      <div className="flex gap-4 perspective-1000">
        {player.influence?.map((card, index) => (
          <InfluenceCard
            key={index}
            card={card}
            index={index}
            isMyTurn={isMyTurn}
            totalCards={player.influence.length}
          />
        ))}
      </div>

      {/* Enhanced Turn indicator */}
      <AnimatePresence>
        {isMyTurn && (
          <motion.div
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            exit={{ scale: 0, x: 20 }}
            className="ml-4"
          >
            <div className="relative">
              {/* Glow background */}
              <div className="absolute inset-0 bg-coup-gold/30 rounded-xl blur-xl" />
              
              <motion.div
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(212, 175, 55, 0.4)',
                    '0 0 40px rgba(212, 175, 55, 0.6)',
                    '0 0 20px rgba(212, 175, 55, 0.4)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative px-5 py-3 bg-gradient-to-r from-coup-gold via-coup-gold-light to-coup-gold 
                  text-coup-dark font-display font-bold rounded-xl flex items-center gap-2"
              >
                <Crown className="w-5 h-5" />
                <motion.span
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  YOUR TURN
                </motion.span>
                <Sparkles className="w-4 h-4" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function InfluenceCard({ card, index, isMyTurn, totalCards }) {
  const [showDetails, setShowDetails] = useState(false)
  const charInfo = CHARACTERS[card.card]
  const cardImage = CARD_IMAGES[card.card]

  if (card.revealed) {
    // Revealed/Dead card
    return (
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 0.92 }}
        className="relative w-32 h-44 rounded-xl overflow-hidden"
        style={{ 
          filter: 'grayscale(80%) brightness(0.4)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}
      >
        <img
          src={cardImage}
          alt={charInfo?.name}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Dead overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div 
            initial={{ rotate: 0 }}
            animate={{ rotate: -12 }}
            className="bg-gradient-to-r from-red-900/90 to-red-800/90 px-4 py-2 rounded-lg 
              border border-red-500/50 shadow-lg"
          >
            <span className="text-red-300 font-display text-sm tracking-wider">REVEALED</span>
          </motion.div>
        </div>
        
        {/* X overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
          <line x1="20" y1="20" x2="80" y2="80" stroke="#ef4444" strokeWidth="3" />
          <line x1="80" y1="20" x2="20" y2="80" stroke="#ef4444" strokeWidth="3" />
        </svg>
      </motion.div>
    )
  }

  // Active card with image - straight vertical, hover moves up
  return (
    <>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ 
          y: -12, 
          scale: 1.03, 
          transition: { type: 'spring', stiffness: 400, damping: 25 }
        }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDetails(true)}
        className="relative w-32 h-44 rounded-xl overflow-hidden cursor-pointer group"
        style={{
          boxShadow: isMyTurn 
            ? '0 10px 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.2)'
            : '0 10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Card Image */}
        <img
          src={cardImage}
          alt={charInfo?.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 
            group-hover:scale-105"
          draggable={false}
        />

        {/* Animated shine effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/30 
            pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Hover hint */}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent
          opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white/80 text-[10px] text-center">Click for details</p>
        </div>

        {/* Border glow */}
        <motion.div 
          className="absolute inset-0 rounded-xl border-2 border-transparent 
            group-hover:border-coup-gold/60 transition-all duration-300 pointer-events-none"
          whileHover={{
            boxShadow: 'inset 0 0 30px rgba(212, 175, 55, 0.3)'
          }}
        />

        {/* Turn glow effect */}
        {isMyTurn && (
          <motion.div
            animate={{ 
              boxShadow: [
                'inset 0 0 20px rgba(212, 175, 55, 0.2)',
                'inset 0 0 50px rgba(212, 175, 55, 0.5)',
                'inset 0 0 20px rgba(212, 175, 55, 0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-xl pointer-events-none"
          />
        )}
        
        {/* Outer glow for turn */}
        {isMyTurn && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-1 rounded-2xl bg-coup-gold/20 blur-md -z-10"
          />
        )}
      </motion.div>

      {/* Card Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <CardDetailsModal 
            card={card} 
            charInfo={charInfo} 
            cardImage={cardImage}
            onClose={() => setShowDetails(false)} 
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Card Details Modal Component
function CardDetailsModal({ card, charInfo, cardImage, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md mx-4"
      >
        {/* Glow background */}
        <div className={`absolute -inset-6 bg-gradient-to-r ${charInfo?.gradient} opacity-40 blur-3xl rounded-3xl`} />
        
        <div className="relative bg-coup-darker/95 border-2 border-coup-gold/50 rounded-2xl overflow-hidden shadow-2xl">
          {/* Header with card image */}
          <div className="relative h-80 overflow-hidden">
            <motion.img
              src={cardImage}
              alt={charInfo?.name}
              className="w-full h-full object-cover"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-coup-darker via-coup-darker/40 to-transparent" />
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center
                text-white hover:bg-black/80 transition-colors border border-white/20"
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            {/* Character name */}
            <motion.div 
              className="absolute bottom-4 left-0 right-0 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`text-5xl font-display font-bold bg-gradient-to-r ${charInfo?.gradient} 
                bg-clip-text text-transparent drop-shadow-2xl`}>
                {charInfo?.name}
              </h2>
            </motion.div>
          </div>
          
          {/* Card abilities */}
          <div className="p-8 space-y-5 max-h-96 overflow-y-auto">
            {/* Action ability */}
            {charInfo?.action && (
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-start gap-4 p-5 bg-coup-gray/60 rounded-xl border-l-4 border-coup-gold"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${charInfo?.gradient} 
                  flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-coup-gold font-display font-bold text-xl">Action: {charInfo?.actionName}</h3>
                  <p className="text-gray-300 text-sm mt-2">{charInfo?.actionDescription}</p>
                </div>
              </motion.div>
            )}
            
            {/* Block ability */}
            {charInfo?.counteraction && (
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-start gap-4 p-5 bg-red-500/10 rounded-xl border-l-4 border-red-500"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-red-600 to-red-700 
                  flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-red-400 font-display font-bold text-xl">Block</h3>
                  <p className="text-gray-300 text-sm mt-2">{charInfo?.counteraction}</p>
                </div>
              </motion.div>
            )}
            
            {/* Special note for Contessa */}
            {!charInfo?.action && (
              <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="p-5 bg-red-500/15 rounded-xl border border-red-500/40 text-center"
              >
                <p className="text-red-300 text-sm italic">
                  💎 The Contessa is pure defense with no offensive action.<br/>
                  She blocks assassinations perfectly but cannot take coins.
                </p>
              </motion.div>
            )}
          </div>
          
          {/* Decorative bottom */}
          <div className={`h-1.5 bg-gradient-to-r ${charInfo?.gradient}`} />
        </div>
      </motion.div>
    </motion.div>
  )
}
