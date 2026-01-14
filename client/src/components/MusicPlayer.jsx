import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Play, Pause, SkipForward } from 'lucide-react'

// Background music player overlay top-right
export default function MusicPlayer() {
  const tracks = [
    { title: 'River Flows In You', src: '/music/Yiruma - River Flows In You.mp3' },
    { title: '96 OST - Track 1', src: '/music/96 (Original Background Score) CD 1 TRACK 1 (320).mp3' }
  ]

  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.15)
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
    audio.addEventListener('ended', onEnded)

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

  const nextTrack = async () => {
    const next = (index + 1) % tracks.length
    setIndex(next)
  }

  const muted = volume === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50 px-3 py-2 glass border border-coup-gold/30 rounded-xl shadow-coup flex items-center gap-2"
      title="Background Music"
    >
      {/* Track Title */}
      <div className="hidden sm:block text-xs font-display text-coup-gold/90 mr-2">
        {tracks[index].title}
      </div>

      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="p-2 rounded-lg hover:bg-white/10 text-white"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>

      {/* Next */}
      <button
        onClick={nextTrack}
        className="p-2 rounded-lg hover:bg-white/10 text-white"
        aria-label="Next track"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      {/* Volume */}
      <div className="flex items-center gap-2 ml-2">
        {muted ? <VolumeX className="w-4 h-4 text-gray-300" /> : <Volume2 className="w-4 h-4 text-gray-300" />}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-24 accent-coup-gold"
          aria-label="Volume"
        />
      </div>

      {/* Autoplay notice */}
      {autoplayBlocked && (
        <div className="text-[10px] text-gray-300 ml-2">Tap play to start</div>
      )}
    </motion.div>
  )
}
