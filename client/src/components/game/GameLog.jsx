import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Coins, 
  Swords, 
  Shield, 
  Skull, 
  Trophy,
  AlertTriangle,
  Info
} from 'lucide-react'

const LOG_ICONS = {
  action: Coins,
  challenge: Swords,
  block: Shield,
  influence: Skull,
  elimination: Skull,
  victory: Trophy,
  warning: AlertTriangle,
  info: Info
}

const LOG_COLORS = {
  action: 'text-coup-gold',
  challenge: 'text-red-400',
  block: 'text-blue-400',
  influence: 'text-orange-400',
  elimination: 'text-red-500',
  victory: 'text-green-400',
  warning: 'text-yellow-400',
  info: 'text-gray-400'
}

export default function GameLog({ logs = [] }) {
  const scrollRef = useRef(null)

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs.length])

  return (
    <div className="h-full flex flex-col bg-coup-darker overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-coup-gray-light flex-shrink-0">
        <h3 className="font-display text-coup-gold flex items-center gap-2">
          <Info className="w-5 h-5" />
          Game Log
        </h3>
      </div>

      {/* Log entries */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-coup-gray-light scrollbar-track-coup-darker"
      >
        {logs.map((log, index) => {
          const Icon = LOG_ICONS[log.type] || Info
          const colorClass = LOG_COLORS[log.type] || 'text-gray-400'

          return (
            <motion.div
              key={`${log.timestamp}-${index}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2 text-sm"
            >
              <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
              <div className="flex-1">
                <p className={colorClass}>{log.message}</p>
                <span className="text-gray-600 text-xs">Turn {log.turn}</span>
              </div>
            </motion.div>
          )
        })}

        {logs.length === 0 && (
          <div className="text-gray-600 text-center py-8">
            <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Game log will appear here</p>
          </div>
        )}
      </div>
    </div>
  )
}
