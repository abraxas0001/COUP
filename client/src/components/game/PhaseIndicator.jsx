import { motion } from 'framer-motion'
import { Clock, Swords, Shield, Target, ArrowLeftRight, Skull, Trophy } from 'lucide-react'
import { GAME_PHASES } from '../../constants/gameConstants'

const PHASE_CONFIG = {
  actionDeclaration: {
    label: 'Action Phase',
    icon: Target,
    color: 'text-coup-gold',
    bg: 'bg-coup-gold/10 border-coup-gold/30'
  },
  awaitingChallenge: {
    label: 'Challenge Window',
    icon: Swords,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30'
  },
  awaitingBlock: {
    label: 'Block Window',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30'
  },
  awaitingBlockChallenge: {
    label: 'Challenge Block',
    icon: Swords,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30'
  },
  resolvingChallenge: {
    label: 'Resolving Challenge',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30'
  },
  resolvingBlockChallenge: {
    label: 'Resolving Block Challenge',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30'
  },
  selectingInfluenceToLose: {
    label: 'Losing Influence',
    icon: Skull,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/30'
  },
  exchangingCards: {
    label: 'Exchanging Cards',
    icon: ArrowLeftRight,
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30'
  },
  gameOver: {
    label: 'Game Over',
    icon: Trophy,
    color: 'text-coup-gold',
    bg: 'bg-coup-gold/10 border-coup-gold/30'
  }
}

export default function PhaseIndicator({ gameState }) {
  const { phase, turnNumber, currentPlayerId, players } = gameState
  const currentPlayer = players?.find(p => p.id === currentPlayerId)
  
  const config = PHASE_CONFIG[phase] || PHASE_CONFIG.actionDeclaration
  const Icon = config.icon

  return (
    <div className="bg-coup-darker/80 backdrop-blur-sm border-b border-coup-gray-light">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Turn Info */}
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-500">Turn </span>
            <span className="text-coup-gold font-display font-bold">{turnNumber}</span>
          </div>
          <div className="w-px h-6 bg-coup-gray-light" />
          <div className="text-sm">
            <span className="text-gray-500">Current: </span>
            <span className="text-white font-medium">{currentPlayer?.name || '—'}</span>
          </div>
        </div>

        {/* Phase Badge */}
        <motion.div
          key={phase}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg}`}
        >
          <Icon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>
            {config.label}
          </span>
        </motion.div>

        {/* Player Count */}
        <div className="text-sm text-gray-500">
          {players?.filter(p => !p.isEliminated).length} players remaining
        </div>
      </div>
    </div>
  )
}
