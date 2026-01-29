import { motion } from 'framer-motion'
import { Home, Crown, Sparkles } from 'lucide-react'
import confetti from '../../utils/confetti'
import { useEffect, useState } from 'react'
import { AVATAR_IMAGES } from '../Avatar'

// Floating particle component
function FloatingParticle({ delay, duration, size, color, left }) {
  return (
    <motion.div
      initial={{ y: '100vh', opacity: 0, rotate: 0 }}
      animate={{ 
        y: '-100vh', 
        opacity: [0, 1, 1, 0],
        rotate: 360
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: 'linear'
      }}
      className="absolute pointer-events-none"
      style={{ left: `${left}%` }}
    >
      <div 
        className={`${size} ${color} rounded-full blur-[1px]`}
        style={{ 
          boxShadow: `0 0 10px currentColor, 0 0 20px currentColor` 
        }}
      />
    </motion.div>
  )
}

// Crown rays animation
function CrownRays() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 bg-gradient-to-t from-coup-gold/80 to-transparent"
          style={{
            height: '200px',
            transformOrigin: 'bottom center',
            rotate: `${i * 30}deg`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ 
            scaleY: [0, 1, 0.8, 1],
            opacity: [0, 0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 2,
            delay: 0.5 + i * 0.1,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
    </div>
  )
}

// Orbiting stars
function OrbitingStars() {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
          }}
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5
          }}
        >
          <motion.div
            className="absolute"
            style={{
              x: 80 + i * 15,
              y: 0,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            <Sparkles className="w-4 h-4 text-coup-gold" />
          </motion.div>
        </motion.div>
      ))}
    </>
  )
}

export default function GameOverModal({ winner, myId, onLeave }) {
  const isWinner = winner?.id === myId
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Trigger confetti for everyone (but more for the winner)
    if (isWinner) {
      confetti()
      setTimeout(() => confetti(), 500)
      setTimeout(() => confetti(), 1000)
    } else {
      setTimeout(() => confetti(), 800)
    }
    
    // Delay content reveal for dramatic effect
    setTimeout(() => setShowContent(true), 300)
  }, [isWinner])

  const winnerAvatarPath = AVATAR_IMAGES[winner?.avatarId] || AVATAR_IMAGES[1]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.3}
            duration={4 + Math.random() * 3}
            size={Math.random() > 0.5 ? 'w-2 h-2' : 'w-3 h-3'}
            color={Math.random() > 0.5 ? 'text-coup-gold' : 'text-coup-purple'}
            left={Math.random() * 100}
          />
        ))}
      </div>

      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-gradient-radial from-coup-gold/10 via-transparent to-transparent" />

      <motion.div
        initial={{ scale: 0.5, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 100 }}
        transition={{ type: 'spring', damping: 15, stiffness: 100 }}
        className="w-full max-w-lg text-center relative z-10"
      >
        {/* Crown Rays behind avatar */}
        <div className="relative">
          <CrownRays />
          <OrbitingStars />
          
          {/* Winner Avatar with epic animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', damping: 12, stiffness: 100 }}
            className="relative mx-auto mb-6"
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute -inset-4 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 20px 5px rgba(212, 175, 55, 0.3), 0 0 40px 10px rgba(212, 175, 55, 0.2)',
                  '0 0 40px 10px rgba(212, 175, 55, 0.5), 0 0 80px 20px rgba(212, 175, 55, 0.3)',
                  '0 0 20px 5px rgba(212, 175, 55, 0.3), 0 0 40px 10px rgba(212, 175, 55, 0.2)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            
            {/* Spinning border */}
            <motion.div
              className="absolute -inset-2 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #D4AF37, #F4D03F, #D4AF37, #9B59B6, #D4AF37)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Inner border */}
            <div className="absolute -inset-1 rounded-full bg-coup-dark" />
            
            {/* Avatar Image */}
            <motion.div
              className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-coup-gold shadow-2xl"
              animate={{
                boxShadow: [
                  '0 0 30px rgba(212, 175, 55, 0.5)',
                  '0 0 50px rgba(212, 175, 55, 0.8)',
                  '0 0 30px rgba(212, 175, 55, 0.5)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <img 
                src={winnerAvatarPath}
                alt={winner?.name || 'Winner'}
                className="w-full h-full object-cover"
              />
              
              {/* Shine sweep effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.div>

            {/* Crown on top */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [-5, 5, -5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Crown className="w-12 h-12 text-coup-gold drop-shadow-lg" fill="currentColor" />
              </motion.div>
            </motion.div>
          </motion.div>
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
                <motion.h1 
                  className="font-display text-6xl text-transparent bg-clip-text bg-gradient-to-r from-coup-gold via-yellow-300 to-coup-gold mb-4"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  VICTORY!
                </motion.h1>
                <p className="text-gray-300 text-lg mb-2">
                  You have eliminated all opposition
                </p>
                <motion.p 
                  className="text-coup-gold font-display text-2xl"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👑 The throne is yours! 👑
                </motion.p>
              </>
            ) : (
              <>
                <motion.h1 
                  className="font-display text-5xl text-white mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Game Over
                </motion.h1>
                <p className="text-gray-400 text-lg mb-2">
                  The winner is
                </p>
                <motion.p 
                  className="text-coup-gold font-display text-4xl"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                >
                  {winner?.name}
                </motion.p>
                <motion.p
                  className="text-gray-500 text-sm mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Better luck next time!
                </motion.p>
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
