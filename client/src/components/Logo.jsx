import { motion } from 'framer-motion'

export default function Logo({ size = 'medium' }) {
  const sizes = {
    small: { text: 'text-2xl', subtitle: 'text-xs' },
    medium: { text: 'text-4xl', subtitle: 'text-sm' },
    large: { text: 'text-7xl', subtitle: 'text-lg' }
  }

  const { text, subtitle } = sizes[size]

  return (
    <motion.div 
      className="text-center"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <h1 className={`font-display ${text} font-bold tracking-[0.2em]`}>
        <span className="text-gradient-gold">COUP</span>
      </h1>
      {size !== 'small' && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${subtitle} text-gray-500 tracking-widest uppercase mt-1`}
        >
          Deceive • Manipulate • Survive
        </motion.p>
      )}
    </motion.div>
  )
}
