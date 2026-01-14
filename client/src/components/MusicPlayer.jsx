import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react'
import { MUSIC_TRACKS } from '../constants/musicTracks'

// Artistic background music player
export default function MusicPlayer() {
  const tracks = MUSIC_TRACKS

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.15)
  const [prevVolume, setPrevVolume] = useState(0.15)
  const [progress, setProgress] = useState(0)
  const [showVolume, setShowVolume] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
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
      setAutoplayBlocked(false)
    }).catch(() => {
      setIsPlaying(false)
      setAutoplayBlocked(true)
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

  const togglePlay = async () => {
    if (!audioRef.current) return
    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
        setAutoplayBlocked(false)
      }
    } catch (e) {
      setAutoplayBlocked(true)
    }
  }

  const nextTrack = () => {
    setProgress(0)
    setIndex((index + 1) % tracks.length)
  }

  const prevTrack = () => {
    setProgress(0)
    setIndex((index - 1 + tracks.length) % tracks.length)
  }

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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-3 right-[340px] z-40"
    >
      {/* Main container with artistic styling */}
      <div className="relative bg-gradient-to-br from-coup-darker/95 via-coup-gray/90 to-coup-darker/95 
        border border-coup-gold/40 rounded-xl overflow-hidden backdrop-blur-md
        shadow-[0_0_20px_rgba(0,0,0,0.5),0_0_40px_rgba(212,175,55,0.1)]"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-coup-gold/60" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-coup-gold/60" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-coup-gold/60" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-coup-gold/60" />
        
        {/* Content */}
        <div className="px-4 pt-3 pb-2">
          {/* Track info */}
          <div className="flex items-center gap-2 mb-2">
            <Music className="w-3 h-3 text-coup-gold/70" />
            <div className="text-xs font-display text-coup-gold tracking-wide truncate max-w-[180px]">
              {tracks[index].title}
            </div>
          </div>
          
          {/* Progress bar - golden thread filling up */}
          <div className="relative h-[2px] bg-coup-gray/50 rounded-full mb-3 overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-coup-gold/80 via-coup-gold to-amber-400
                shadow-[0_0_8px_rgba(212,175,55,0.6)]"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
            {/* Glowing dot at progress point */}
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-coup-gold rounded-full
                shadow-[0_0_6px_rgba(212,175,55,0.8)]"
              style={{ left: `calc(${progress}% - 3px)` }}
            />
          </div>
          
          {/* Controls row */}
          <div className="flex items-center justify-center gap-1">
            {/* Previous */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={prevTrack}
              className="p-1.5 rounded-lg text-gray-400 hover:text-coup-gold hover:bg-white/5 transition-colors"
              aria-label="Previous track"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </motion.button>

            {/* Play/Pause - main button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="p-2 mx-1 rounded-full bg-gradient-to-br from-coup-gold/20 to-coup-gold/5 
                border border-coup-gold/40 text-coup-gold hover:border-coup-gold/60 
                hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] transition-all"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </motion.button>

            {/* Next */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextTrack}
              className="p-1.5 rounded-lg text-gray-400 hover:text-coup-gold hover:bg-white/5 transition-colors"
              aria-label="Next track"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </motion.button>

            {/* Volume control */}
            <div 
              className="relative ml-2"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMute}
                className={`p-1.5 rounded-lg transition-colors ${
                  muted ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-coup-gold'
                } hover:bg-white/5`}
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </motion.button>
              
              {/* Volume slider popup on hover */}
              <AnimatePresence>
                {showVolume && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
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
                      className="w-20 h-1 accent-coup-gold cursor-pointer"
                      aria-label="Volume"
                    />
                    <div className="text-[10px] text-center text-gray-400 mt-1">
                      {Math.round(volume * 100)}%
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Autoplay notice */}
        {autoplayBlocked && (
          <div className="px-4 pb-2 text-[10px] text-center text-amber-400/80">
            Click play to start music
          </div>
        )}
      </div>
    </motion.div>
  )
}
