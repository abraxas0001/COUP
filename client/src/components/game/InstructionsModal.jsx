import { motion, AnimatePresence } from 'framer-motion'
import { X, Coins, Sword, HandCoins, Crown, Skull, Users, ArrowLeftRight, Shield, HelpCircle } from 'lucide-react'
import { CHARACTERS, ACTIONS } from '../../constants/gameConstants'

// Card image paths
const CARD_IMAGES = {
  duke: '/cards/duke.svg',
  assassin: '/cards/assassin.svg',
  captain: '/cards/captain.svg',
  ambassador: '/cards/ambassador.svg',
  contessa: '/cards/contessa.svg'
}

export default function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        >
          {/* Background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-coup-purple/30 via-coup-gold/20 to-coup-purple/30 
            blur-3xl rounded-3xl opacity-50" />
          
          <div className="relative bg-coup-darker/98 border-2 border-coup-gold/40 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-coup-darker/95 backdrop-blur-sm border-b border-coup-gold/30 p-6">
              <div className="flex items-center justify-between">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-coup-gold to-coup-gold-dark
                    flex items-center justify-center">
                    <HelpCircle className="w-6 h-6 text-coup-dark" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-coup-gold">Game Guide</h2>
                    <p className="text-gray-400 text-sm">Master the art of deception</p>
                  </div>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 bg-coup-gray rounded-full flex items-center justify-center
                    text-gray-400 hover:text-white hover:bg-coup-gray-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Basic Actions Section */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-xl font-display text-white mb-4 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-coup-gold" />
                  Basic Actions
                  <span className="text-xs text-gray-500 font-normal">(Cannot be challenged)</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ActionCard 
                    icon={<Coins className="w-5 h-5" />}
                    name="Income"
                    description="Take 1 coin from the Treasury"
                    cost={null}
                    canBlock={false}
                    canChallenge={false}
                    gradient="from-gray-600 to-gray-700"
                  />
                  <ActionCard 
                    icon={<HandCoins className="w-5 h-5" />}
                    name="Foreign Aid"
                    description="Take 2 coins from the Treasury"
                    cost={null}
                    canBlock={true}
                    canChallenge={false}
                    blockedBy="Duke"
                    gradient="from-yellow-600 to-yellow-700"
                  />
                  <ActionCard 
                    icon={<Sword className="w-5 h-5" />}
                    name="Coup"
                    description="Pay 7 coins, target loses 1 influence"
                    cost={7}
                    canBlock={false}
                    canChallenge={false}
                    gradient="from-red-600 to-red-800"
                    note="Mandatory at 10+ coins"
                  />
                </div>
              </motion.section>

              {/* Character Cards Section */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-display text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-coup-gold" />
                  Character Cards
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {Object.values(CHARACTERS).map((char, index) => (
                    <CharacterInfoCard key={char.id} character={char} index={index} />
                  ))}
                </div>
              </motion.section>

              {/* Quick Reference Table */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-xl font-display text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-coup-gold" />
                  Blocking Reference
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-coup-gold/30">
                        <th className="text-left p-3 text-coup-gold font-display">Action</th>
                        <th className="text-left p-3 text-coup-gold font-display">Can Be Blocked By</th>
                        <th className="text-left p-3 text-coup-gold font-display">Can Be Challenged?</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-coup-gray">
                        <td className="p-3 text-gray-300">Income</td>
                        <td className="p-3 text-gray-500">—</td>
                        <td className="p-3 text-gray-500">No</td>
                      </tr>
                      <tr className="border-b border-coup-gray">
                        <td className="p-3 text-gray-300">Foreign Aid</td>
                        <td className="p-3 text-purple-400">Duke</td>
                        <td className="p-3 text-gray-500">No</td>
                      </tr>
                      <tr className="border-b border-coup-gray">
                        <td className="p-3 text-gray-300">Coup</td>
                        <td className="p-3 text-gray-500">—</td>
                        <td className="p-3 text-gray-500">No</td>
                      </tr>
                      <tr className="border-b border-coup-gray">
                        <td className="p-3 text-purple-300">Tax (Duke)</td>
                        <td className="p-3 text-gray-500">—</td>
                        <td className="p-3 text-green-400">Yes</td>
                      </tr>
                      <tr className="border-b border-coup-gray">
                        <td className="p-3 text-gray-400">Assassinate (Assassin)</td>
                        <td className="p-3 text-red-400">Contessa</td>
                        <td className="p-3 text-green-400">Yes</td>
                      </tr>
                      <tr className="border-b border-coup-gray">
                        <td className="p-3 text-blue-300">Steal (Captain)</td>
                        <td className="p-3 text-cyan-400">Captain, Ambassador</td>
                        <td className="p-3 text-green-400">Yes</td>
                      </tr>
                      <tr className="border-b border-coup-gray">
                        <td className="p-3 text-green-300">Exchange (Ambassador)</td>
                        <td className="p-3 text-gray-500">—</td>
                        <td className="p-3 text-green-400">Yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.section>

              {/* Challenge Rules */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-xl font-display text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-coup-gold" />
                  Challenge Rules
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                    <h4 className="text-green-400 font-display font-semibold mb-2">Successful Challenge</h4>
                    <p className="text-gray-400 text-sm">
                      If you challenge and the player <span className="text-red-400">doesn't</span> have the claimed card, 
                      they lose an influence. The action is cancelled.
                    </p>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
                    <h4 className="text-red-400 font-display font-semibold mb-2">Failed Challenge</h4>
                    <p className="text-gray-400 text-sm">
                      If you challenge and the player <span className="text-green-400">does</span> have the card, 
                      you lose an influence. They shuffle their card back and draw a new one.
                    </p>
                  </div>
                </div>
              </motion.section>

              {/* Win Condition */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center p-6 bg-coup-gold/10 rounded-xl border border-coup-gold/30"
              >
                <Crown className="w-12 h-12 text-coup-gold mx-auto mb-3" />
                <h3 className="text-2xl font-display text-coup-gold mb-2">Victory Condition</h3>
                <p className="text-gray-400">
                  Be the last player with at least one influence card remaining. 
                  Eliminate all opponents by making them lose both influence cards.
                </p>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Action Card Component
function ActionCard({ icon, name, description, cost, canBlock, canChallenge, blockedBy, gradient, note }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`p-4 bg-gradient-to-br ${gradient} rounded-xl border border-white/10 
        shadow-lg relative overflow-hidden`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h4 className="text-white font-display font-semibold">{name}</h4>
          {cost && <span className="text-xs text-yellow-300">Cost: {cost} coins</span>}
        </div>
      </div>
      <p className="text-white/80 text-sm">{description}</p>
      {blockedBy && (
        <p className="text-xs text-red-300 mt-2">⛔ Blocked by: {blockedBy}</p>
      )}
      {note && (
        <p className="text-xs text-yellow-300 mt-2 italic">⚠️ {note}</p>
      )}
    </motion.div>
  )
}

// Character Info Card Component
function CharacterInfoCard({ character, index }) {
  const cardImage = CARD_IMAGES[character.id]
  
  return (
    <motion.div
      initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.1 + index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="flex gap-4 p-4 bg-coup-gray/50 rounded-xl border border-coup-gold/20 overflow-hidden"
    >
      {/* Card image */}
      <div className="relative w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
        <img 
          src={cardImage} 
          alt={character.name}
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${character.gradient} opacity-20`} />
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-lg font-display font-bold bg-gradient-to-r ${character.gradient} 
          bg-clip-text text-transparent`}>
          {character.name}
        </h4>
        
        <div className="mt-2 space-y-2">
          {/* Action */}
          {character.action && (
            <div className="flex items-start gap-2">
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full flex-shrink-0">
                Action
              </span>
              <div>
                <span className="text-white text-sm font-medium">{character.actionName}</span>
                <p className="text-gray-500 text-xs">{character.actionDescription}</p>
              </div>
            </div>
          )}
          
          {/* Block */}
          {character.counteraction && (
            <div className="flex items-start gap-2">
              <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full flex-shrink-0">
                Block
              </span>
              <span className="text-gray-400 text-sm">{character.counteraction}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
