import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function InstructionsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 250, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto"
        >
          {/* Background glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-coup-purple/30 via-coup-gold/20 to-coup-purple/30 
            blur-3xl rounded-3xl opacity-50" />
          
          <div className="relative bg-coup-darker/98 border-2 border-coup-gold/40 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-coup-darker/95 backdrop-blur-sm border-b border-coup-gold/30 p-4">
              <div className="flex items-center justify-between">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-3"
                >
                  <h2 className="text-2xl font-display font-bold text-coup-gold">Quick Reference</h2>
                </motion.div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-9 h-9 bg-coup-gray rounded-full flex items-center justify-center
                    text-gray-400 hover:text-white hover:bg-coup-gray-light transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Quick Reference Table - Compact version */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-coup-gold/30">
                        <th className="text-left p-3 text-coup-gold font-display text-sm">Character</th>
                        <th className="text-left p-3 text-coup-gold font-display text-sm">Action</th>
                        <th className="text-left p-3 text-coup-gold font-display text-sm">Effect</th>
                        <th className="text-left p-3 text-coup-gold font-display text-sm">Can Block</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-coup-gray hover:bg-coup-gray/30 transition-colors">
                        <td className="p-3 text-gray-300"><span className="text-purple-400 font-semibold">Duke</span></td>
                        <td className="p-3 text-gray-300">Tax</td>
                        <td className="p-3 text-gray-400 text-xs">Take 3 coins</td>
                        <td className="p-3 text-gray-400">Foreign Aid</td>
                      </tr>
                      <tr className="border-b border-coup-gray hover:bg-coup-gray/30 transition-colors">
                        <td className="p-3 text-gray-300"><span className="text-gray-400 font-semibold">Assassin</span></td>
                        <td className="p-3 text-gray-300">Assassinate</td>
                        <td className="p-3 text-gray-400 text-xs">Force lose influence</td>
                        <td className="p-3 text-gray-400">—</td>
                      </tr>
                      <tr className="border-b border-coup-gray hover:bg-coup-gray/30 transition-colors">
                        <td className="p-3 text-gray-300"><span className="text-blue-400 font-semibold">Captain</span></td>
                        <td className="p-3 text-gray-300">Steal</td>
                        <td className="p-3 text-gray-400 text-xs">Take 2 coins</td>
                        <td className="p-3 text-gray-400">Stealing</td>
                      </tr>
                      <tr className="border-b border-coup-gray hover:bg-coup-gray/30 transition-colors">
                        <td className="p-3 text-gray-300"><span className="text-green-400 font-semibold">Ambassador</span></td>
                        <td className="p-3 text-gray-300">Exchange</td>
                        <td className="p-3 text-gray-400 text-xs">Draw & return cards</td>
                        <td className="p-3 text-gray-400">Stealing</td>
                      </tr>
                      <tr className="hover:bg-coup-gray/30 transition-colors">
                        <td className="p-3 text-gray-300"><span className="text-red-400 font-semibold">Contessa</span></td>
                        <td className="p-3 text-gray-300">—</td>
                        <td className="p-3 text-gray-400 text-xs">No action</td>
                        <td className="p-3 text-gray-400">Assassination</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.section>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
