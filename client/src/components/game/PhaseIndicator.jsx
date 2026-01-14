import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Swords, Shield, Target, ArrowLeftRight, Skull, Trophy, Users, Hash } from 'lucide-react'
import { GAME_PHASES } from '../../constants/gameConstants'

const PHASE_CONFIG = {
  actionDeclaration: {
    label: 'Action Phase',
    icon: Target,
    color: 'text-coup-gold',
    bg: 'bg-gradient-to-r from-coup-gold/20 to-coup-gold/5',
    border: 'border-coup-gold/40',
    glow: 'shadow-[0_0_15px_rgba(212,175,55,0.3)]'
  },
  awaitingChallenge: {
    label: 'Challenge Window',
    icon: Swords,
    color: 'text-red-400',
    bg: 'bg-gradient-to-r from-red-500/20 to-red-500/5',
    border: 'border-red-500/40',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
  },
  awaitingBlock: {
    label: 'Block Window',
    icon: Shield,
    color: 'text-blue-400',
    bg: 'bg-gradient-to-r from-blue-500/20 to-blue-500/5',
    border: 'border-blue-500/40',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]'
  },
  awaitingBlockChallenge: {
    label: 'Challenge Block',
    icon: Swords,
    color: 'text-orange-400',
    bg: 'bg-gradient-to-r from-orange-500/20 to-orange-500/5',
    border: 'border-orange-500/40',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]'
  },
  resolvingChallenge: {
    label: 'Resolving Challenge',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-500/40',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'
  },
  resolvingBlockChallenge: {
    label: 'Resolving Block Challenge',
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-gradient-to-r from-yellow-500/20 to-yellow-500/5',
    border: 'border-yellow-500/40',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]'
  },
  selectingInfluenceToLose: {
    label: 'Losing Influence',
    icon: Skull,
    color: 'text-red-400',
    bg: 'bg-gradient-to-r from-red-500/20 to-red-500/5',
    border: 'border-red-500/40',
    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
  },
  exchangingCards: {
    label: 'Exchanging Cards',
    icon: ArrowLeftRight,
    color: 'text-green-400',
    bg: 'bg-gradient-to-r from-green-500/20 to-green-500/5',
    border: 'border-green-500/40',
    glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]'
  },
  gameOver: {
    label: 'Game Over',
    icon: Trophy,
    color: 'text-coup-gold',
    bg: 'bg-gradient-to-r from-coup-gold/30 to-coup-gold/10',
    border: 'border-coup-gold/50',
    glow: 'shadow-[0_0_20px_rgba(212,175,55,0.5)]'
  }
}

export default function PhaseIndicator({ gameState }) {
  const { phase, turnNumber, currentPlayerId, players } = gameState
  const currentPlayer = players?.find(p => p.id === currentPlayerId)
  const alivePlayers = players?.filter(p => !p.isEliminated).length || 0
  
  const config = PHASE_CONFIG[phase] || PHASE_CONFIG.actionDeclaration
  const Icon = config.icon

  return (
    <div className="bg-gradient-to-r from-coup-darker via-coup-dark to-coup-darker border-b border-coup-gold/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Turn Info */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="flex items-center gap-2 px-3 py-1.5 bg-coup-gray/50 rounded-lg border border-coup-gray-light"
            whileHover={{ scale: 1.02 }}
          >
            <Hash className="w-4 h-4 text-coup-gold/60" />
            <span className="text-gray-400 text-sm">Turn</span>
            <motion.span 
              key={turnNumber}
              initial={{ scale: 1.2, color: '#D4AF37' }}
              animate={{ scale: 1, color: '#D4AF37' }}
              className="text-coup-gold font-display font-bold text-lg"
            >
              {turnNumber}
            </motion.span>
          </motion.div>
          
          <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-coup-gold/30 to-transparent" />
          
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-400 text-sm">Active:</span>
            <span className="text-white font-medium">{currentPlayer?.name || '—'}</span>
          </div>
        </div>

        {/* Phase Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ scale: 0.8, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`flex items-center gap-2 px-5 py-2 rounded-full border backdrop-blur-sm
              ${config.bg} ${config.border} ${config.glow}`}
          >
            <motion.div
              animate={{ rotate: phase === 'resolvingChallenge' || phase === 'resolvingBlockChallenge' ? 360 : 0 }}
              transition={{ duration: 2, repeat: phase.includes('resolving') ? Infinity : 0, ease: 'linear' }}
            >
              <Icon className={`w-4 h-4 ${config.color}`} />
            </motion.div>
            <span className={`text-sm font-display tracking-wide ${config.color}`}>
              {config.label}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Player Count */}
        <motion.div 
          className="flex items-center gap-2 px-3 py-1.5 bg-coup-gray/50 rounded-lg border border-coup-gray-light"
          whileHover={{ scale: 1.02 }}
        >
          <Users className="w-4 h-4 text-green-500/60" />
          <span className="text-gray-400 text-sm hidden sm:inline">Remaining:</span>
          <span className="text-green-400 font-bold">{alivePlayers}</span>
        </motion.div>
      </div>
    </div>
  )
}
