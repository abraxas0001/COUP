import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { X } from 'lucide-react'

export default function CoupDeck({ deckSize }) {
  const [showInstructions, setShowInstructions] = useState(false)
  
  return (
    <>
      {/* Deck Container */}
      <div className="flex flex-col items-center">
        {/* Clickable Deck */}
        <motion.button
          onClick={() => setShowInstructions(true)}
          className="relative cursor-pointer focus:outline-none group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 -m-6 bg-coup-purple/20 blur-2xl rounded-full group-hover:bg-coup-purple/40 transition-colors" />
          
          {/* Deck stack - creates 3D effect */}
          <div className="relative">
            {/* Bottom shadow cards */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute"
                style={{
                  width: '100px',
                  height: '140px',
                  top: `${(4 - i) * 2}px`,
                  left: `${(4 - i) * 1}px`,
                  zIndex: i,
                }}
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
              </div>
            ))}
            
            {/* Main top card */}
            <div className="relative w-[100px] h-[140px] z-10 group-hover:-translate-y-1 transition-transform">
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
                    <div className="w-16 h-16 rounded-full border-2 border-coup-gold/40 
                      flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border border-coup-gold/30 
                        flex items-center justify-center bg-coup-darker/50">
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
                      </div>
                    </div>
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
              </div>
            </div>
          </div>
        </motion.button>
        
        {/* Card count - simple text below */}
        <div className="mt-4 text-center">
          <motion.span 
            key={deckSize}
            initial={{ scale: 1.5, color: '#D4AF37' }}
            animate={{ scale: 1, color: '#D4AF37' }}
            className="text-2xl font-bold text-coup-gold font-display"
          >
            {deckSize}
          </motion.span>
          <p className="text-xs text-gray-500 mt-1">cards left</p>
        </div>
      </div>

      {/* Instructions Modal - OUTSIDE the button */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInstructions(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl mx-4"
            >
              {/* Glow */}
              <div className="absolute -inset-2 bg-coup-gold/20 blur-2xl rounded-2xl" />
              
              <div className="relative bg-coup-darker border-2 border-coup-gold/50 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-coup-gold/30 bg-coup-gray/30">
                  <h2 className="text-xl font-display font-bold text-coup-gold">Quick Reference</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowInstructions(false)}
                    className="w-8 h-8 bg-coup-gray rounded-full flex items-center justify-center
                      text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {/* Table */}
                <div className="p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-coup-gold/30">
                        <th className="text-left p-3 text-coup-gold font-display">Character</th>
                        <th className="text-left p-3 text-coup-gold font-display">Action</th>
                        <th className="text-left p-3 text-coup-gold font-display">Effect</th>
                        <th className="text-left p-3 text-coup-gold font-display">Can Block</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-coup-gray/50 hover:bg-coup-gray/20">
                        <td className="p-3"><span className="text-purple-400 font-semibold">Duke</span></td>
                        <td className="p-3 text-gray-300">Tax</td>
                        <td className="p-3 text-gray-400">Take 3 coins</td>
                        <td className="p-3 text-gray-400">Foreign Aid</td>
                      </tr>
                      <tr className="border-b border-coup-gray/50 hover:bg-coup-gray/20">
                        <td className="p-3"><span className="text-gray-400 font-semibold">Assassin</span></td>
                        <td className="p-3 text-gray-300">Assassinate (3💰)</td>
                        <td className="p-3 text-gray-400">Kill influence</td>
                        <td className="p-3 text-gray-500">—</td>
                      </tr>
                      <tr className="border-b border-coup-gray/50 hover:bg-coup-gray/20">
                        <td className="p-3"><span className="text-blue-400 font-semibold">Captain</span></td>
                        <td className="p-3 text-gray-300">Steal</td>
                        <td className="p-3 text-gray-400">Take 2 coins</td>
                        <td className="p-3 text-gray-400">Stealing</td>
                      </tr>
                      <tr className="border-b border-coup-gray/50 hover:bg-coup-gray/20">
                        <td className="p-3"><span className="text-green-400 font-semibold">Ambassador</span></td>
                        <td className="p-3 text-gray-300">Exchange</td>
                        <td className="p-3 text-gray-400">Swap cards</td>
                        <td className="p-3 text-gray-400">Stealing</td>
                      </tr>
                      <tr className="hover:bg-coup-gray/20">
                        <td className="p-3"><span className="text-red-400 font-semibold">Contessa</span></td>
                        <td className="p-3 text-gray-500">—</td>
                        <td className="p-3 text-gray-500">No action</td>
                        <td className="p-3 text-gray-400">Assassination</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
