import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Shield, Swords, Zap, Target, Crown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { CHARACTERS } from '../../constants/gameConstants'
import Avatar from '../Avatar'
import CoupDeck from './CoupDeck'
import Treasury from './Treasury'

// Card image paths
const CARD_IMAGES = {
  duke: '/cards/duke.png',
  assassin: '/cards/assassin.png',
  captain: '/cards/captain.png',
  ambassador: '/cards/ambassador.png',
  contessa: '/cards/contessa.png'
}

export default function GameTable({ gameState, myId }) {
  const [previousState, setPreviousState] = useState(null)
  const [coinFlows, setCoinFlows] = useState([])
  const flowIdRef = useRef(0)
  
  const { 
    players, 
    currentPlayerId, 
    currentAction, 
    currentTarget, 
    blockingPlayer, 
    phase,
    deckSize 
  } = gameState

  // Track state changes for coin animations
  useEffect(() => {
    if (previousState) {
      const flows = []
      
      gameState.players.forEach(player => {
        const prevPlayer = previousState.players?.find(p => p.id === player.id)
        if (prevPlayer && prevPlayer.coins !== player.coins) {
          const diff = player.coins - prevPlayer.coins
          flowIdRef.current += 1
          
          flows.push({
            id: flowIdRef.current,
            targetId: player.id,
            amount: diff,
            timestamp: Date.now()
          })
        }
      })
      
      if (flows.length > 0) {
        setCoinFlows(prev => [...prev, ...flows])
        setTimeout(() => {
          setCoinFlows(prev => prev.filter(f => Date.now() - f.timestamp < 2000))
        }, 2500)
      }
    }
    
    setPreviousState(gameState)
  }, [gameState])

  // Arrange players in a circle around the table
  const otherPlayers = players.filter(p => p.id !== myId)
  
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-coup-purple/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-coup-gold/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Other Players Area */}
      <div className="flex-1 flex items-start justify-center gap-4 md:gap-6 pt-6 flex-wrap px-4 relative z-10">
        {otherPlayers.map((player, index) => (
          <PlayerSlot
            key={player.id}
            player={player}
            isCurrentPlayer={player.id === currentPlayerId}
            isTarget={player.id === currentTarget}
            isBlocking={player.id === blockingPlayer}
            index={index}
            phase={phase}
            coinFlow={coinFlows.find(f => f.targetId === player.id)}
          />
        ))}
      </div>

      {/* Center Table Area - Treasury, Deck & Action Display */}
      <div className="flex justify-center items-center py-8 relative z-10">
        {/* Treasury on left */}
        <div className="flex items-center">
          <Treasury gameState={gameState} previousState={previousState} />
          {/* Narrow golden thread connecting Treasury to Deck */}
          <div className="w-24 md:w-40 h-[1px] bg-gradient-to-r from-coup-gold/50 via-coup-gold/80 to-coup-gold/50 
            shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
        </div>
        
        {/* Deck centered below user cards */}
        <div className="mx-4">
          <CoupDeck deckSize={deckSize} />
        </div>
        
        {/* Action Display on right with connecting thread */}
        <div className="flex items-center">
          {/* Narrow golden thread connecting Deck to Action Display */}
          <div className="w-24 md:w-40 h-[1px] bg-gradient-to-r from-coup-gold/50 via-coup-gold/80 to-coup-gold/50 
            shadow-[0_0_6px_rgba(212,175,55,0.4)]" />
          
          {/* Action Display - fixed width to prevent layout shift */}
          <div className="w-56 md:w-72 min-h-[140px] flex items-center justify-center 
            bg-gradient-to-b from-coup-gray/50 to-coup-darker/50 
            border-2 border-coup-gold/30 rounded-2xl p-3
            backdrop-blur-sm">
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-coup-gold/50 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-coup-gold/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-coup-gold/50 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-coup-gold/50 rounded-br-lg" />
            
            <AnimatePresence mode="wait">
              {currentAction ? (
                <motion.div
                  key="action"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full"
                >
                  <ActionDisplay gameState={gameState} />
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-500 text-xs text-center font-display tracking-wider"
                >
                  AWAITING ACTION
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function PlayerSlot({ player, isCurrentPlayer, isTarget, isBlocking, index, phase, coinFlow }) {
  const [showCoinChange, setShowCoinChange] = useState(false)
  const [coinChangeAmount, setCoinChangeAmount] = useState(0)
  
  useEffect(() => {
    if (coinFlow) {
      setCoinChangeAmount(coinFlow.amount)
      setShowCoinChange(true)
      setTimeout(() => setShowCoinChange(false), 1500)
    }
  }, [coinFlow])

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
      className={`relative group`}
    >
      {/* Glow effect for active states */}
      <AnimatePresence>
        {isCurrentPlayer && !player.isEliminated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -inset-2 bg-coup-gold/20 rounded-2xl blur-xl -z-10"
          />
        )}
        {isTarget && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -inset-2 bg-red-500/30 rounded-2xl blur-xl -z-10"
          />
        )}
      </AnimatePresence>

      {/* Main card */}
      <div className={`relative p-4 rounded-xl transition-all duration-300 backdrop-blur-sm min-w-[140px]
        ${player.isEliminated 
          ? 'opacity-50 bg-coup-gray/50 border-2 border-gray-700'
          : isCurrentPlayer 
            ? 'bg-gradient-to-b from-coup-gold/15 to-coup-gold/5 border-2 border-coup-gold shadow-coup' 
            : isTarget
              ? 'bg-gradient-to-b from-red-500/15 to-red-500/5 border-2 border-red-500/60'
              : isBlocking
                ? 'bg-gradient-to-b from-blue-500/15 to-blue-500/5 border-2 border-blue-500/60'
                : 'bg-gradient-to-b from-coup-gray-light/80 to-coup-gray/80 border-2 border-coup-gray-light hover:border-coup-gold/30'
        }`}
      >
        {/* Status indicator */}
        <AnimatePresence>
          {isCurrentPlayer && !player.isEliminated && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 
                bg-gradient-to-r from-coup-gold via-coup-gold-light to-coup-gold 
                text-coup-dark text-xs font-bold rounded-full shadow-lg
                flex items-center gap-1"
            >
              <Crown className="w-3 h-3" />
              TURN
            </motion.div>
          )}
          
          {isTarget && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 
                bg-gradient-to-r from-red-500 to-red-600
                text-white text-xs font-bold rounded-full shadow-lg
                flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              TARGET
            </motion.div>
          )}
          
          {isBlocking && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 
                bg-gradient-to-r from-blue-500 to-blue-600
                text-white text-xs font-bold rounded-full shadow-lg
                flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              BLOCKING
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center">
          {/* Avatar with ring effect */}
          <div className="relative">
            <motion.div
              animate={isCurrentPlayer && !player.isEliminated ? {
                boxShadow: ['0 0 0 0 rgba(212, 175, 55, 0)', '0 0 0 10px rgba(212, 175, 55, 0)'],
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="rounded-full"
            >
              <Avatar id={player.avatarId} size="medium" />
            </motion.div>
            
            {/* Online indicator */}
            {!player.isEliminated && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full 
                border-2 border-coup-dark shadow-lg" />
            )}
          </div>

          {/* Name */}
          <p className={`mt-2 font-medium text-sm truncate max-w-[110px] ${
            player.isEliminated ? 'text-gray-600 line-through' : 'text-white'
          }`}>
            {player.name}
          </p>

          {/* Coins with animation */}
          <div className="relative mt-2">
            <motion.div 
              className="flex items-center gap-1.5 px-3 py-1 bg-coup-darker/60 rounded-full border border-coup-gold/20"
              animate={showCoinChange ? { scale: [1, 1.1, 1] } : {}}
            >
              <Coins className="w-4 h-4 text-coup-gold" />
              <span className="text-coup-gold font-bold">{player.coins}</span>
            </motion.div>
            
            {/* Coin change indicator */}
            <AnimatePresence>
              {showCoinChange && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -25 }}
                  exit={{ opacity: 0, y: -40 }}
                  className={`absolute left-1/2 -translate-x-1/2 text-sm font-bold
                    ${coinChangeAmount > 0 ? 'text-green-400' : 'text-red-400'}`}
                >
                  {coinChangeAmount > 0 ? '+' : ''}{coinChangeAmount}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Influence Cards */}
          <div className="flex gap-2 mt-3">
            {/* Hidden cards (face down) */}
            {Array.from({ length: player.influenceCount }).map((_, i) => (
              <motion.div
                key={`hidden-${i}`}
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="relative w-11 h-16 rounded-lg overflow-hidden shadow-card
                  bg-gradient-to-br from-coup-purple via-coup-purple-dark to-coup-darker
                  border border-coup-gold/40 group-hover:border-coup-gold/60 transition-colors"
              >
                {/* Card back pattern */}
                <div className="absolute inset-1 border border-coup-gold/20 rounded" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border border-coup-gold/30 rounded-full 
                    flex items-center justify-center bg-coup-darker/30">
                    <span className="text-coup-gold/60 text-xs font-display">?</span>
                  </div>
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 
                  group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
            
            {/* Revealed cards (with images) */}
            {player.revealedCards?.map((card, i) => {
              const cardImage = CARD_IMAGES[card]
              return (
                <motion.div
                  key={`revealed-${i}`}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 180 }}
                  className="relative w-11 h-16 rounded-lg overflow-hidden shadow-md"
                  style={{ filter: 'grayscale(70%) brightness(0.5)' }}
                >
                  <img
                    src={cardImage}
                    alt={card}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  {/* X mark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                      <span className="text-white text-xs">✕</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Eliminated badge */}
          {player.isEliminated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-2 px-2 py-0.5 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs"
            >
              ELIMINATED
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ActionDisplay({ gameState }) {
  const { 
    currentAction, 
    currentPlayerId, 
    currentTarget, 
    claimedCard, 
    blockingPlayer, 
    blockingCard, 
    players,
    phase 
  } = gameState
  
  const actingPlayer = players.find(p => p.id === currentPlayerId)
  const targetPlayer = currentTarget ? players.find(p => p.id === currentTarget) : null
  const blocker = blockingPlayer ? players.find(p => p.id === blockingPlayer) : null

  const actionConfig = {
    income: { name: 'Income', icon: Coins, color: 'text-coup-gold', coins: '+1' },
    foreignAid: { name: 'Foreign Aid', icon: Coins, color: 'text-coup-gold', coins: '+2' },
    coup: { name: 'Coup', icon: Zap, color: 'text-red-400', coins: '-7' },
    tax: { name: 'Tax', icon: Coins, color: 'text-purple-400', coins: '+3' },
    assassinate: { name: 'Assassinate', icon: Swords, color: 'text-gray-400', coins: '-3' },
    steal: { name: 'Steal', icon: Coins, color: 'text-blue-400', coins: '+2' },
    exchange: { name: 'Exchange', icon: Shield, color: 'text-green-400', coins: '0' }
  }

  const config = actionConfig[currentAction] || { name: currentAction, icon: Coins, color: 'text-white' }
  const Icon = config.icon

  return (
    <div className="glass border border-coup-gold/30 rounded-xl px-6 py-4 max-w-lg">
      {/* Main action info */}
      <div className="flex items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color} bg-white/10`}
        >
          <Icon className="w-5 h-5" />
        </motion.div>
        
        <div className="text-center">
          <div className="flex items-center gap-2 text-gray-300 text-sm flex-wrap justify-center">
            <span className="text-coup-gold font-semibold">{actingPlayer?.name}</span>
            {claimedCard && (
              <>
                <span className="text-gray-500">claims</span>
                <span className="text-white font-medium capitalize px-2 py-0.5 bg-white/10 rounded">
                  {claimedCard}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-1 justify-center flex-wrap">
            <span className={`font-display text-lg ${config.color}`}>
              {config.name}
            </span>
            {targetPlayer && (
              <>
                <span className="text-gray-500">→</span>
                <span className="text-red-400 font-semibold">{targetPlayer.name}</span>
              </>
            )}
          </div>
        </div>
        
        {config.coins && config.coins !== '0' && (
          <div className={`px-3 py-1 rounded-full text-sm font-bold
            ${config.coins.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {config.coins}
          </div>
        )}
      </div>
      
      {/* Block info */}
      <AnimatePresence>
        {blocker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-coup-gold/20"
          >
            <div className="flex items-center justify-center gap-2 text-blue-400 flex-wrap">
              <Shield className="w-4 h-4" />
              <span className="font-semibold">{blocker.name}</span>
              <span className="text-gray-400">claims</span>
              <span className="capitalize font-medium px-2 py-0.5 bg-blue-500/20 rounded">
                {blockingCard}
              </span>
              <span className="text-gray-400">to block!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Phase indicator */}
      <div className="mt-3 flex justify-center">
        <PhaseChip phase={phase} />
      </div>
    </div>
  )
}

function PhaseChip({ phase }) {
  const phaseConfig = {
    actionDeclaration: { label: 'Action Phase', color: 'bg-coup-gold/20 text-coup-gold border-coup-gold/30' },
    awaitingChallenge: { label: 'Challenge Window', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    awaitingBlock: { label: 'Block Window', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    awaitingBlockChallenge: { label: 'Challenge Block', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    resolvingChallenge: { label: 'Resolving...', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    resolvingBlockChallenge: { label: 'Resolving...', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    selectingInfluenceToLose: { label: 'Select Card', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    exchangingCards: { label: 'Exchanging', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  }
  
  const config = phaseConfig[phase] || { label: phase, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  
  return (
    <motion.div
      key={phase}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.label}
    </motion.div>
  )
}
