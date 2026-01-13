import { motion } from 'framer-motion'
import { Coins } from 'lucide-react'
import { CHARACTERS } from '../../constants/gameConstants'
import Avatar from '../Avatar'

// Card image paths
const CARD_IMAGES = {
  duke: '/cards/duke.svg',
  assassin: '/cards/assassin.svg',
  captain: '/cards/captain.svg',
  ambassador: '/cards/ambassador.svg',
  contessa: '/cards/contessa.svg'
}

export default function GameTable({ gameState, myId }) {
  const { players, currentPlayerId, currentAction, currentTarget, blockingPlayer, phase } = gameState

  // Arrange players in a circle around the table
  const otherPlayers = players.filter(p => p.id !== myId)
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Other Players Area */}
      <div className="flex-1 flex items-start justify-center gap-6 pt-8 flex-wrap">
        {otherPlayers.map((player, index) => (
          <PlayerSlot
            key={player.id}
            player={player}
            isCurrentPlayer={player.id === currentPlayerId}
            isTarget={player.id === currentTarget}
            isBlocking={player.id === blockingPlayer}
            index={index}
            phase={phase}
          />
        ))}
      </div>

      {/* Center Table Area */}
      <div className="flex justify-center items-center py-8">
        <div className="relative">
          {/* Deck visualization */}
          <div className="relative">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-20 h-28 bg-gradient-to-br from-coup-gray to-coup-darker 
                  border-2 border-coup-gold/30 rounded-lg"
                style={{
                  top: `${i * -2}px`,
                  left: `${i * 2}px`,
                  zIndex: 3 - i
                }}
              />
            ))}
            <div className="relative w-20 h-28 bg-gradient-to-br from-coup-gray to-coup-darker 
              border-2 border-coup-gold/30 rounded-lg flex items-center justify-center z-10">
              <span className="font-display text-coup-gold text-xs">COURT</span>
            </div>
          </div>
          
          {/* Deck count */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-500">
            {gameState.deckSize} cards
          </div>
        </div>
      </div>

      {/* Current Action Display */}
      {currentAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center pb-4"
        >
          <div className="glass border border-coup-gold/30 rounded-xl px-6 py-3">
            <ActionDisplay gameState={gameState} />
          </div>
        </motion.div>
      )}
    </div>
  )
}

function PlayerSlot({ player, isCurrentPlayer, isTarget, isBlocking, index, phase }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative p-4 rounded-xl transition-all ${
        player.isEliminated 
          ? 'opacity-40'
          : isCurrentPlayer 
            ? 'bg-coup-gold/10 border-2 border-coup-gold ring-2 ring-coup-gold/30' 
            : isTarget
              ? 'bg-red-500/10 border-2 border-red-500/50'
              : isBlocking
                ? 'bg-blue-500/10 border-2 border-blue-500/50'
                : 'bg-coup-gray border-2 border-coup-gray-light'
      }`}
    >
      {/* Turn indicator */}
      {isCurrentPlayer && !player.isEliminated && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-coup-gold text-coup-dark text-xs font-bold rounded">
          TURN
        </div>
      )}

      {/* Target indicator */}
      {isTarget && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">
          TARGET
        </div>
      )}

      {/* Blocking indicator */}
      {isBlocking && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">
          BLOCKING
        </div>
      )}

      <div className="flex flex-col items-center min-w-[120px]">
        {/* Avatar */}
        <Avatar id={player.avatarId} size="medium" />

        {/* Name */}
        <p className={`mt-2 font-medium text-sm truncate max-w-[100px] ${
          player.isEliminated ? 'text-gray-500 line-through' : 'text-white'
        }`}>
          {player.name}
        </p>

        {/* Coins */}
        <div className="flex items-center gap-1 mt-1">
          <Coins className="w-4 h-4 text-coup-gold" />
          <span className="text-coup-gold font-semibold">{player.coins}</span>
        </div>

        {/* Influence Cards */}
        <div className="flex gap-1 mt-2">
          {/* Hidden cards (face down) */}
          {Array.from({ length: player.influenceCount }).map((_, i) => (
            <div
              key={`hidden-${i}`}
              className="w-10 h-14 bg-gradient-to-br from-coup-purple/80 to-coup-dark 
                border border-coup-gold/30 rounded-lg shadow-md relative overflow-hidden"
            >
              {/* Card back pattern */}
              <div className="absolute inset-1 border border-coup-gold/20 rounded" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border border-coup-gold/30 rounded-full flex items-center justify-center">
                  <span className="text-coup-gold/50 text-xs">?</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Revealed cards (with images) */}
          {player.revealedCards?.map((card, i) => {
            const cardImage = CARD_IMAGES[card]
            return (
              <div
                key={`revealed-${i}`}
                className="w-10 h-14 rounded-lg overflow-hidden shadow-md relative"
                style={{ filter: 'grayscale(60%) brightness(0.6)' }}
              >
                <img
                  src={cardImage}
                  alt={card}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            )
          })}
        </div>

        {/* Eliminated */}
        {player.isEliminated && (
          <span className="text-red-400 text-xs mt-1">Eliminated</span>
        )}
      </div>
    </motion.div>
  )
}

function ActionDisplay({ gameState }) {
  const { currentAction, currentPlayerId, currentTarget, claimedCard, blockingPlayer, blockingCard, players } = gameState
  
  const actingPlayer = players.find(p => p.id === currentPlayerId)
  const targetPlayer = currentTarget ? players.find(p => p.id === currentTarget) : null
  const blocker = blockingPlayer ? players.find(p => p.id === blockingPlayer) : null

  const actionNames = {
    income: 'Income',
    foreignAid: 'Foreign Aid',
    coup: 'Coup',
    tax: 'Tax',
    assassinate: 'Assassinate',
    steal: 'Steal',
    exchange: 'Exchange'
  }

  return (
    <div className="text-center">
      <p className="text-gray-300">
        <span className="text-coup-gold font-semibold">{actingPlayer?.name}</span>
        {' '}
        {claimedCard && (
          <>claims <span className="text-white font-medium capitalize">{claimedCard}</span> for </>
        )}
        <span className="text-white font-medium">{actionNames[currentAction]}</span>
        {targetPlayer && (
          <> on <span className="text-red-400 font-semibold">{targetPlayer.name}</span></>
        )}
      </p>
      
      {blocker && (
        <p className="text-blue-400 mt-2">
          <span className="font-semibold">{blocker.name}</span> claims{' '}
          <span className="capitalize font-medium">{blockingCard}</span> to block!
        </p>
      )}
    </div>
  )
}
