import { User } from 'lucide-react'

// Avatar image paths - using actual filenames
const AVATAR_IMAGES = {
  1: '/avatars/Bleh.png',
  2: '/avatars/High%20IQ%20Nigga.png',
  3: '/avatars/Meh.png',
  4: '/avatars/Red%20Hair%20Baddie.jpeg',
  5: '/avatars/Supreme%20MadDog.png',
  6: '/avatars/Ultimate%20Bhatura.png',
  7: '/avatars/Abra.jpg',
}

// Avatar names for display (extracted from filenames)
const AVATAR_NAMES = {
  1: 'Bleh',
  2: 'High IQ Nigga',
  3: 'Meh',
  4: 'Red Hair Baddie',
  5: 'Supreme MadDog',
  6: 'Ultimate Bhatura',
  7: 'Abra',
}

// Border colors for each avatar
const AVATAR_COLORS = {
  1: 'border-violet-500 shadow-violet-500/30',
  2: 'border-red-500 shadow-red-500/30',
  3: 'border-cyan-500 shadow-cyan-500/30',
  4: 'border-emerald-500 shadow-emerald-500/30',
  5: 'border-rose-500 shadow-rose-500/30',
  6: 'border-amber-500 shadow-amber-500/30',
  7: 'border-blue-500 shadow-blue-500/30',
}

const sizes = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16',
  xlarge: 'w-24 h-24',
  winner: 'w-32 h-32',
}

export default function Avatar({ id, size = 'medium', className = '', showBorder = true }) {
  const imagePath = AVATAR_IMAGES[id] || AVATAR_IMAGES[1]
  const borderColor = AVATAR_COLORS[id] || AVATAR_COLORS[1]
  
  return (
    <div 
      className={`${sizes[size]} rounded-xl overflow-hidden 
        ${showBorder ? `border-2 ${borderColor} shadow-lg` : ''}
        bg-coup-gray ${className}`}
    >
      <img 
        src={imagePath} 
        alt={AVATAR_NAMES[id] || 'Avatar'}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-600 to-gray-800"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>'
        }}
      />
    </div>
  )
}

export { AVATAR_IMAGES, AVATAR_NAMES, AVATAR_COLORS }
