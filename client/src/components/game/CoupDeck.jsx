import { motion } from 'framer-motion'

export default function CoupDeck({ deckSize }) {
  return (
    <motion.div 
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 -m-6 bg-coup-purple/20 blur-2xl rounded-full" />
      
      {/* Deck stack - creates 3D effect */}
      <div className="relative">
        {/* Bottom shadow cards */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: '100px',
              height: '140px',
              top: `${(4 - i) * 2}px`,
              left: `${(4 - i) * 1}px`,
              zIndex: i,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1 - (i * 0.15), y: 0 }}
            transition={{ delay: 0.1 * i }}
          >
            <div 
              className="w-full h-full rounded-xl"
              style={{
                background: `linear-gradient(145deg, 
                  rgba(107, 63, 160, ${0.3 - i * 0.05}) 0%, 
                  rgba(13, 13, 13, ${0.8 - i * 0.1}) 100%)`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              }}
            />
          </motion.div>
        ))}
        
        {/* Main top card - detailed back design */}
        <motion.div 
          className="relative w-[100px] h-[140px] z-10"
          whileHover={{ 
            y: -5, 
            rotateZ: 2,
            transition: { duration: 0.3 }
          }}
        >
          {/* Card base */}
          <div className="absolute inset-0 rounded-xl overflow-hidden shadow-card
            bg-gradient-to-br from-coup-purple via-coup-purple-dark to-coup-darker
            border-2 border-coup-gold/50">
            
            {/* Inner border frame */}
            <div className="absolute inset-2 rounded-lg border border-coup-gold/30" />
            
            {/* Ornate corner decorations */}
            <CornerDecoration className="top-3 left-3" />
            <CornerDecoration className="top-3 right-3 rotate-90" />
            <CornerDecoration className="bottom-3 left-3 -rotate-90" />
            <CornerDecoration className="bottom-3 right-3 rotate-180" />
            
            {/* Center design */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Outer ring */}
                <div className="w-16 h-16 rounded-full border-2 border-coup-gold/40 
                  flex items-center justify-center">
                  {/* Inner decorative ring */}
                  <div className="w-12 h-12 rounded-full border border-coup-gold/30 
                    flex items-center justify-center bg-coup-darker/50">
                    {/* Crown/emblem */}
                    <motion.div
                      animate={{ 
                        rotate: 360,
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" 
                          stroke="url(#goldGradient)" 
                          strokeWidth="1.5" 
                          fill="none"
                        />
                        <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#D4AF37" />
                            <stop offset="50%" stopColor="#F4D03F" />
                            <stop offset="100%" stopColor="#996515" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </motion.div>
                  </div>
                </div>
                
                {/* Radiating lines */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-4 bg-gradient-to-b from-coup-gold/40 to-transparent"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-28px)`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Title at top */}
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <span className="font-display text-[8px] text-coup-gold tracking-[0.3em] uppercase">
                Coup
              </span>
            </div>
            
            {/* Subtitle at bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
              <span className="font-display text-[7px] text-coup-gold/60 tracking-wider">
                COURT DECK
              </span>
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent 
              opacity-0 hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>
      </div>
      
      {/* Card count badge - prominent display */}
      <motion.div 
        className="absolute -bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex flex-col items-center gap-1 bg-coup-darker/95 border-2 border-coup-gold/50 
          rounded-xl px-4 py-2 shadow-lg backdrop-blur-sm">
          <motion.span 
            key={deckSize}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-coup-gold font-display"
          >
            {deckSize}
          </motion.span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Cards Left</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CornerDecoration({ className }) {
  return (
    <div className={`absolute w-3 h-3 ${className}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path 
          d="M0 0L12 0L12 3L3 3L3 12L0 12L0 0Z" 
          fill="url(#cornerGold)"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="cornerGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
