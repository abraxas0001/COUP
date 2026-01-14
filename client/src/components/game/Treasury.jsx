import { motion, AnimatePresence } from 'framer-motion'
import { Coins, TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function Treasury({ gameState, previousState }) {
  const [coinAnimations, setCoinAnimations] = useState([])
  const animationIdRef = useRef(0)
  
  const { players, currentAction, currentPlayerId, currentTarget, phase } = gameState

  // Track coin changes between states
  useEffect(() => {
    if (!previousState || !gameState) return

    const newAnimations = []
    
    gameState.players.forEach(player => {
      const prevPlayer = previousState.players?.find(p => p.id === player.id)
      if (prevPlayer && prevPlayer.coins !== player.coins) {
        const diff = player.coins - prevPlayer.coins
        animationIdRef.current += 1
        
        newAnimations.push({
          id: animationIdRef.current,
          playerId: player.id,
          playerName: player.name,
          amount: Math.abs(diff),
          direction: diff > 0 ? 'in' : 'out',
          timestamp: Date.now()
        })
      }
    })

    if (newAnimations.length > 0) {
      setCoinAnimations(prev => [...prev, ...newAnimations])
      
      // Clean up old animations after they complete
      setTimeout(() => {
        setCoinAnimations(prev => 
          prev.filter(a => Date.now() - a.timestamp < 2000)
        )
      }, 2500)
    }
  }, [gameState, previousState])

  return (
    <div className="relative">
      {/* Treasury Container */}
      <motion.div 
        className="relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 -m-4 rounded-full bg-gradient-to-r from-coup-gold/20 via-transparent to-coup-gold/20 blur-xl animate-pulse-slow" />
        
        {/* Main treasury box */}
        <div className="relative z-10 bg-gradient-to-b from-coup-gray via-coup-darker to-coup-gray 
          border-2 border-coup-gold/40 rounded-2xl p-6 shadow-coup">
          
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-coup-gold rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-coup-gold rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-coup-gold rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-coup-gold rounded-br-lg" />
          
          {/* Treasury icon and label */}
          <div className="flex flex-col items-center gap-2">
            <motion.div 
              className="relative"
              animate={{ 
                rotateY: [0, 360],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coup-gold via-coup-gold-light to-coup-gold-dark 
                flex items-center justify-center shadow-lg">
                <Coins className="w-8 h-8 text-coup-dark" />
              </div>
              {/* Shine effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-transparent" />
            </motion.div>
            
            <span className="font-display text-coup-gold text-sm tracking-widest">TREASURY</span>
            
            {/* Infinity symbol - unlimited coins */}
            <div className="text-coup-gold/60 text-xs">∞ coins</div>
          </div>
        </div>
      </motion.div>

      {/* Floating Coin Animations */}
      <AnimatePresence>
        {coinAnimations.map((anim) => (
          <FloatingCoin key={anim.id} animation={anim} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function FloatingCoin({ animation }) {
  const isIncoming = animation.direction === 'in'
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 pointer-events-none z-50"
      initial={{ 
        x: isIncoming ? 0 : 0,
        y: 0,
        scale: 0,
        opacity: 0
      }}
      animate={{ 
        x: isIncoming ? [0, 80, 120] : [0, -80, -120],
        y: isIncoming ? [0, -40, -80] : [0, -40, -80],
        scale: [0, 1.2, 1],
        opacity: [0, 1, 0]
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      <div className="flex items-center gap-2 bg-coup-dark/90 border border-coup-gold/50 
        rounded-full px-3 py-1.5 shadow-coup">
        {isIncoming ? (
          <TrendingUp className="w-4 h-4 text-green-400" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-400" />
        )}
        <span className={`font-bold text-sm ${isIncoming ? 'text-green-400' : 'text-red-400'}`}>
          {isIncoming ? '+' : '-'}{animation.amount}
        </span>
        <Coins className="w-4 h-4 text-coup-gold" />
      </div>
    </motion.div>
  )
}
