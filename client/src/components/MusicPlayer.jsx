import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { MUSIC_TRACKS } from '../constants/musicTracks'

// Minimal artistic music player - just title, timeline, volume
export default function MusicPlayer() {
  const tracks = MUSIC_TRACKS

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.15)
  const [prevVolume, setPrevVolume] = useState(0.15)
  const [progress, setProgress] = useState(0)
  const [showVolume, setShowVolume] = useState(false)
  const audioRef = useRef(null)

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio(tracks[index].src)
    audio.loop = false
    audio.volume = volume
    audioRef.current = audio

    const onEnded = () => {
      const next = (index + 1) % tracks.length
      setIndex(next)
    }
    
    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('timeupdate', onTimeUpdate)

    // Attempt to autoplay
    audio.play().then(() => {
      setIsPlaying(true)
    }).catch(() => {
      setIsPlaying(false)
    })

    return () => {
      audio.pause()
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.src = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  // Update volume on change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume)
      setVolume(0)
    } else {
      setVolume(prevVolume || 0.15)
    }
  }

  const muted = volume === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-3 right-[340px] z-40 flex items-center gap-3"
    >
      {/* Volume button with horizontal popup */}
      <div 
        className="relative flex items-center"
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMute}
          className={`p-1 transition-colors ${
            muted ? 'text-red-400/80' : 'text-coup-gold/70 hover:text-coup-gold'
          }`}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </motion.button>
        
        {/* Horizontal volume slider popup on hover */}
        <AnimatePresence>
          {showVolume && (
            <motion.div
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -10, scale: 0.95 }}
              className="absolute left-full ml-2 flex items-center gap-2 px-3 py-1.5
                bg-coup-darker/95 border border-coup-gold/30 rounded-lg backdrop-blur-md
                shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 accent-coup-gold cursor-pointer"
                aria-label="Volume"
              />
              <span className="text-[10px] text-gray-400 w-7">
                {Math.round(volume * 100)}%
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Track title and progress */}
      <div className="flex flex-col min-w-[140px]">
        {/* Track name */}
        <div className="text-xs font-display text-coup-gold/90 tracking-wide truncate">
          {tracks[index].title}
        </div>
        
        {/* Progress bar - golden thread filling up */}
        <div className="relative h-[2px] bg-coup-gray/40 rounded-full mt-1 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-coup-gold/70 via-coup-gold to-amber-400
              shadow-[0_0_6px_rgba(212,175,55,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
