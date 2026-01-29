import { motion } from 'framer-motion'
import { AVATAR_IMAGES, AVATAR_NAMES } from './Avatar'

// Generate avatars array from AVATAR_NAMES
const AVATARS = Object.keys(AVATAR_NAMES).map(id => ({
  id: parseInt(id),
  name: AVATAR_NAMES[id]
}))

export default function AvatarSelector({ selectedId, onSelect }) {
  const handleSelect = (avatarId) => {
    const avatarName = AVATAR_NAMES[avatarId] || 'Player'
    onSelect(avatarId, avatarName)
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {AVATARS.map((avatar) => {
        const isSelected = selectedId === avatar.id
        const imagePath = AVATAR_IMAGES[avatar.id]
        
        return (
          <motion.button
            key={avatar.id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(avatar.id)}
            className={`relative w-16 h-16 rounded-xl overflow-hidden transition-all
              ${isSelected 
                ? 'ring-2 ring-coup-gold ring-offset-2 ring-offset-coup-dark shadow-lg shadow-coup-gold/30' 
                : 'opacity-60 hover:opacity-100 grayscale hover:grayscale-0'}`}
          >
            <img 
              src={imagePath} 
              alt={avatar.name}
              className="w-full h-full object-cover"
            />
            {isSelected && (
              <motion.div
                layoutId="avatar-selected"
                className="absolute inset-0 rounded-xl ring-2 ring-coup-gold"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent 
              opacity-0 hover:opacity-100 transition-opacity" />
          </motion.button>
        )
      })}
    </div>
  )
}

export { AVATARS }
