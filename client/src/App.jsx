import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import Home from './pages/Home'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import HowToPlay from './pages/HowToPlay'
import ParticleBackground from './components/ParticleBackground'

function App() {
  const { initializeSocket, disconnect } = useGameStore()

  useEffect(() => {
    initializeSocket()
    
    return () => {
      disconnect()
    }
  }, [initializeSocket, disconnect])

  return (
    <div className="min-h-screen bg-coup-dark relative">
      <ParticleBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/lobby/:lobbyCode" element={<Lobby />} />
        <Route path="/game/:lobbyCode" element={<Game />} />
      </Routes>
    </div>
  )
}

export default App
