import { Hexagon, Triangle, Diamond, Star, Zap, Sparkles, User } from 'lucide-react'

const AVATAR_CONFIG = {
  1: { icon: Hexagon, color: 'from-violet-500 to-purple-700', bgPattern: 'bg-gradient-to-br' },
  2: { icon: Triangle, color: 'from-cyan-400 to-teal-600', bgPattern: 'bg-gradient-to-br' },
  3: { icon: Diamond, color: 'from-rose-400 to-pink-600', bgPattern: 'bg-gradient-to-br' },
  4: { icon: Star, color: 'from-amber-400 to-orange-600', bgPattern: 'bg-gradient-to-br' },
  5: { icon: Zap, color: 'from-emerald-400 to-green-600', bgPattern: 'bg-gradient-to-br' },
  6: { icon: Sparkles, color: 'from-sky-400 to-indigo-600', bgPattern: 'bg-gradient-to-br' },
}

const sizes = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16'
}

const iconSizes = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8'
}

export default function Avatar({ id, size = 'medium', className = '' }) {
  const config = AVATAR_CONFIG[id] || { icon: User, color: 'from-gray-500 to-gray-700' }
  const Icon = config.icon
  
  return (
    <div 
      className={`${sizes[size]} rounded-xl bg-gradient-to-br ${config.color} 
        flex items-center justify-center ${className}`}
    >
      <Icon className={`${iconSizes[size]} text-white`} />
    </div>
  )
}
