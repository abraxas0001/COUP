import { useState } from 'react'
import { motion } from 'framer-motion'
import { Swords, Shield, CheckCircle, Crown, Anchor, Scroll } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { CHARACTERS } from '../../constants/gameConstants'

export default function ResponsePanel({ gameState, myId }) {
  const { challenge, block, allowAction } = useGameStore()
  const [isResponding, setIsResponding] = useState(false)

  const { 
    canChallenge, 
    canBlock, 
    blockOptions, 
    canAllow,
    phase,
    currentAction,
    currentPlayerId,
    blockingPlayer,
    players
  } = gameState

  const actingPlayer = players.find(p => p.id === currentPlayerId)
  const blocker = blockingPlayer ? players.find(p => p.id === blockingPlayer) : null

  // Don't show anything if no response options
  if (!canChallenge && !canBlock && !canAllow) {
    return (
      <div className="flex items-center justify-center h-20 text-gray-500">
        {phase === 'actionDeclaration' && currentPlayerId !== myId && (
          <span>Waiting for {actingPlayer?.name} to act...</span>
        )}
        {phase === 'selectingInfluenceToLose' && (
          <span>Waiting for player to select influence...</span>
        )}
        {phase === 'exchangingCards' && (
          <span>Waiting for player to complete exchange...</span>
        )}
        {phase === 'resolvingChallenge' && (
          <span>Resolving challenge...</span>
        )}
        {phase === 'resolvingBlockChallenge' && (
          <span>Resolving block challenge...</span>
        )}
      </div>
    )
  }

  const handleChallenge = async () => {
    setIsResponding(true)
    try {
      await challenge()
    } catch (err) {
      console.error('Challenge failed:', err)
    }
    setIsResponding(false)
  }

  const handleBlock = async (card) => {
    setIsResponding(true)
    try {
      await block(card)
    } catch (err) {
      console.error('Block failed:', err)
    }
    setIsResponding(false)
  }

  const handleAllow = async () => {
    setIsResponding(true)
    try {
      await allowAction()
    } catch (err) {
      console.error('Allow failed:', err)
    }
    setIsResponding(false)
  }

  // Determine what we're responding to
  const respondingToBlock = phase === 'awaitingBlockChallenge'
  const respondingToAction = phase === 'awaitingChallenge' || phase === 'awaitingBlock'

  return (
    <div className="space-y-3">
      {/* Context */}
      <div className="text-sm text-gray-400">
        {respondingToBlock ? (
          <span>
            <span className="text-blue-400 font-semibold">{blocker?.name}</span> claims to block. 
            Challenge their claim?
          </span>
        ) : (
          <span>
            <span className="text-coup-gold font-semibold">{actingPlayer?.name}</span> declared an action. 
            How do you respond?
          </span>
        )}
      </div>

      {/* Response Buttons */}
      <div className="flex flex-wrap gap-3">
        {/* Challenge Button */}
        {canChallenge && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChallenge}
            disabled={isResponding}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30
              text-red-400 border-2 border-red-500/50 rounded-xl font-display font-medium
              transition-all disabled:opacity-50"
          >
            <Swords className="w-5 h-5" />
            Challenge
          </motion.button>
        )}

        {/* Block Options */}
        {canBlock && blockOptions?.length > 0 && (
          <div className="flex gap-2">
            {blockOptions.map((cardId) => {
              const charInfo = CHARACTERS[cardId]
              return (
                <motion.button
                  key={cardId}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBlock(cardId)}
                  disabled={isResponding}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl font-display font-medium
                    transition-all disabled:opacity-50
                    bg-gradient-to-r ${charInfo?.gradient || 'from-gray-500 to-gray-700'} text-white`}
                >
                  <Shield className="w-5 h-5" />
                  Block with {charInfo?.name}
                </motion.button>
              )
            })}
          </div>
        )}

        {/* Allow Button */}
        {canAllow && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAllow}
            disabled={isResponding}
            className="flex items-center gap-2 px-6 py-3 bg-green-500/20 hover:bg-green-500/30
              text-green-400 border-2 border-green-500/50 rounded-xl font-display font-medium
              transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5" />
            Allow
          </motion.button>
        )}
      </div>
    </div>
  )
}
