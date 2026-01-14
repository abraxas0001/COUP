import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Coins, 
  HandCoins, 
  Sword, 
  Crown, 
  Skull, 
  Anchor, 
  ArrowLeftRight,
  Target,
  X
} from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { CHARACTERS } from '../../constants/gameConstants'

const ACTION_ICONS = {
  income: Coins,
  foreignAid: HandCoins,
  coup: Sword,
  tax: Crown,
  assassinate: Skull,
  steal: Anchor,
  exchange: ArrowLeftRight
}

export default function ActionPanel({ actions, playerCoins }) {
  const { performAction } = useGameStore()
  const [selectedAction, setSelectedAction] = useState(null)
  const [isPerforming, setIsPerforming] = useState(false)

  const handleActionClick = (action) => {
    if (action.requiresTarget && action.availableTargets?.length > 0) {
      setSelectedAction(action)
    } else {
      executeAction(action.action, null)
    }
  }

  const handleTargetSelect = (targetId) => {
    executeAction(selectedAction.action, targetId)
    setSelectedAction(null)
  }

  const executeAction = async (action, targetId) => {
    setIsPerforming(true)
    try {
      await performAction(action, targetId)
    } catch (err) {
      console.error('Action failed:', err)
    }
    setIsPerforming(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Choose your action:</span>
        {playerCoins >= 10 && (
          <span className="text-red-400 font-semibold animate-pulse">
            You must Coup! (10+ coins)
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {actions?.map((action) => {
          const Icon = ACTION_ICONS[action.action]
          const charInfo = action.requiresCharacter ? CHARACTERS[action.requiresCharacter] : null
          const canAfford = playerCoins >= (action.cost || 0)

          return (
            <motion.button
              key={action.action}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleActionClick(action)}
              disabled={!canAfford || isPerforming}
              className={`relative flex items-center gap-2 px-4 py-3 rounded-xl font-medium
                transition-all disabled:opacity-40 disabled:cursor-not-allowed
                ${charInfo 
                  ? `bg-gradient-to-r ${charInfo.gradient} text-white hover:shadow-lg` 
                  : 'bg-coup-gray text-white hover:bg-coup-gray-light border border-coup-gray-light'
                }`}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span>{action.name}</span>
              
              {action.cost > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  canAfford ? 'bg-white/20' : 'bg-red-500/50'
                }`}>
                  -{action.cost}
                </span>
              )}
              
              {charInfo && (
                <span className="text-xs opacity-75">
                  ({charInfo.name})
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Target Selection Modal - Rendered as centered overlay */}
      {selectedAction && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedAction(null)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass border border-coup-gold/30 rounded-2xl shadow-coup overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-coup-gray-light">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-coup-gold" />
                  <h2 className="font-display text-xl text-coup-gold">Select Target for {selectedAction.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedAction(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-coup-gray rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Body */}
              <div className="p-6">
                <div className="flex flex-wrap gap-3">
                  {selectedAction.availableTargets?.map((target) => (
                    <motion.button
                      key={target.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTargetSelect(target.id)}
                      className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 
                        text-red-400 border border-red-500/50 rounded-lg font-medium
                        transition-colors"
                    >
                      {target.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
