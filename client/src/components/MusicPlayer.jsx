import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack } from 'lucide-react'
import { MUSIC_TRACKS } from '../constants/musicTracks'

// Minimal artistic music player - title, timeline, tiny controls, volume
export default function MusicPlayer() {
  const tracks = MUSIC_TRACKS

  // Random starting track
  const [index, setIndex] = useState(() => Math.floor(Math.random() * tracks.length))
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
      // Random next track
      const next = Math.floor(Math.random() * tracks.length)
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

  const togglePlay = async () => {
    if (!audioRef.current) return
    try {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        await audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (e) {
      // ignore
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

      {/* Track title, progress bar, and mini controls */}
      <div className="flex flex-col min-w-[160px]">
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
        
        {/* Mini control buttons */}
        <div className="flex items-center justify-center gap-3 mt-1.5">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevTrack}
            className="text-coup-gold/50 hover:text-coup-gold transition-colors"
            aria-label="Previous"
          >
            <SkipBack className="w-3 h-3" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="text-coup-gold/70 hover:text-coup-gold transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextTrack}
            className="text-coup-gold/50 hover:text-coup-gold transition-colors"
            aria-label="Next"
          >
            <SkipForward className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
