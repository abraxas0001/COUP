import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store/gameStore'
import GameTable from '../components/game/GameTable'
import PlayerHand from '../components/game/PlayerHand'
import ActionPanel from '../components/game/ActionPanel'
import GameLog from '../components/game/GameLog'
import ResponsePanel from '../components/game/ResponsePanel'
import ExchangeModal from '../components/game/ExchangeModal'
import InfluenceLossModal from '../components/game/InfluenceLossModal'
import GameOverModal from '../components/game/GameOverModal'
import PhaseIndicator from '../components/game/PhaseIndicator'
import { Loader2 } from 'lucide-react'
import MusicPlayer from '../components/MusicPlayer'

export default function Game() {
  const { lobbyCode } = useParams()
  const navigate = useNavigate()
  const { gameState, socket, resetGame, lobby, isConnected, currentLobbyCode } = useGameStore()
  
  const [showExchangeModal, setShowExchangeModal] = useState(false)
  const [showInfluenceLossModal, setShowInfluenceLossModal] = useState(false)
  const [loadingTimeout, setLoadingTimeout] = useState(false)

  // Get my player data
  const myId = socket?.id
  const myPlayer = gameState?.players?.find(p => p.id === myId)

  // Store current lobby code for reconnection
  useEffect(() => {
    if (lobbyCode && !currentLobbyCode) {
      localStorage.setItem('currentLobbyCode', lobbyCode)
    }
  }, [lobbyCode, currentLobbyCode])

  // Redirect to home if game doesn't exist after timeout or no connection
  useEffect(() => {
    // Only start timeout if connected but no game state
    if (!gameState && !lobby && isConnected) {
      const timer = setTimeout(() => {
        setLoadingTimeout(true)
      }, 5000) // 5 second timeout (increased for reconnection)
      
      return () => clearTimeout(timer)
    }
  }, [gameState, lobby, isConnected])

  // Redirect when timeout occurs or connection issues
  useEffect(() => {
    if (loadingTimeout && !gameState) {
      console.log('Game not found, redirecting to home...')
      resetGame()
      navigate('/')
    }
  }, [loadingTimeout, gameState, navigate, resetGame])

  // Watch for phase changes that require modals
  useEffect(() => {
    if (!gameState) return

    if (gameState.exchangeOptions && gameState.phase === 'exchangingCards') {
      setShowExchangeModal(true)
    } else {
      setShowExchangeModal(false)
    }

    if (gameState.mustSelectInfluence) {
      setShowInfluenceLossModal(true)
    } else {
      setShowInfluenceLossModal(false)
    }
  }, [gameState?.phase, gameState?.exchangeOptions, gameState?.mustSelectInfluence])

  // Handle leaving game
  const handleLeave = () => {
    resetGame()
    navigate('/')
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coup-dark">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-coup-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            {!isConnected ? 'Connecting to server...' : 'Loading game...'}
          </p>
          {!isConnected && (
            <p className="text-yellow-500 text-sm mt-2">Reconnecting to server...</p>
          )}
          {loadingTimeout && isConnected && (
            <div className="mt-4">
              <p className="text-gray-500 text-sm mb-4">Game not found or has ended.</p>
              <button
                onClick={() => {
                  resetGame()
                  navigate('/')
                }}
                className="btn-primary"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const isGameOver = gameState.phase === 'gameOver'
  const isMyTurn = gameState.isYourTurn

  return (
    <div className="h-screen bg-coup-dark game-table table-spotlight flex flex-col overflow-hidden relative">
      {/* Background music player */}
      <MusicPlayer />
      {/* Animated background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-2 h-2 bg-coup-gold/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-1 h-1 bg-coup-gold/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-coup-purple/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-coup-gold/20 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 right-10 w-2 h-2 bg-coup-purple/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Phase Indicator */}
      <PhaseIndicator gameState={gameState} />

      {/* Main Game Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Game Table (Center) */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <GameTable 
            gameState={gameState} 
            myId={myId}
          />
        </div>

        {/* Game Log (Right Sidebar) */}
        <div className="w-80 hidden lg:block border-l border-coup-gray-light overflow-hidden">
          <GameLog logs={gameState.gameLog} />
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="flex-shrink-0 border-t border-coup-gray-light bg-coup-darker/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-end gap-6">
            {/* Player Hand */}
            <div className="flex-shrink-0">
              <PlayerHand 
                player={myPlayer} 
                isMyTurn={isMyTurn}
              />
            </div>

            {/* Action/Response Panel */}
            <div className="flex-1">
              {isMyTurn && gameState.phase === 'actionDeclaration' ? (
                <ActionPanel 
                  actions={gameState.availableActions}
                  playerCoins={myPlayer?.coins || 0}
                />
              ) : (
                <ResponsePanel 
                  gameState={gameState}
                  myId={myId}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showExchangeModal && gameState.exchangeOptions && (
          <ExchangeModal
            exchangeOptions={gameState.exchangeOptions}
            onClose={() => setShowExchangeModal(false)}
          />
        )}

        {showInfluenceLossModal && myPlayer && (
          <InfluenceLossModal
            player={myPlayer}
            onClose={() => setShowInfluenceLossModal(false)}
          />
        )}

        {isGameOver && (
          <GameOverModal
            winner={gameState.winner}
            myId={myId}
            onLeave={handleLeave}
            players={gameState.players}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
