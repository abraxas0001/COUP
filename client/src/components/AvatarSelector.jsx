import { motion } from 'framer-motion'
import { Hexagon, Triangle, Diamond, Star, Zap, Sparkles } from 'lucide-react'

const AVATARS = [
  { id: 1, icon: Hexagon, color: 'from-violet-500 to-purple-700', name: 'Hex' },
  { id: 2, icon: Triangle, color: 'from-cyan-400 to-teal-600', name: 'Prism' },
  { id: 3, icon: Diamond, color: 'from-rose-400 to-pink-600', name: 'Gem' },
  { id: 4, icon: Star, color: 'from-amber-400 to-orange-600', name: 'Nova' },
  { id: 5, icon: Zap, color: 'from-emerald-400 to-green-600', name: 'Bolt' },
  { id: 6, icon: Sparkles, color: 'from-sky-400 to-indigo-600', name: 'Cosmic' },
]

export default function AvatarSelector({ selectedId, onSelect }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {AVATARS.map((avatar) => {
        const Icon = avatar.icon
        const isSelected = selectedId === avatar.id
        
        return (
          <motion.button
            key={avatar.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(avatar.id)}
            className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${avatar.color} 
              flex items-center justify-center transition-all
              ${isSelected ? 'ring-2 ring-coup-gold ring-offset-2 ring-offset-coup-dark' : 'opacity-60 hover:opacity-100'}`}
          >
            <Icon className="w-7 h-7 text-white" />
            {isSelected && (
              <motion.div
                layoutId="avatar-selected"
                className="absolute inset-0 rounded-xl ring-2 ring-coup-gold"
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export { AVATARS }
