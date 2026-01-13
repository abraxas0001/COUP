import { CHARACTERS, ACTIONS, ACTION_INFO, GAME_PHASES } from './constants.js';

class Player {
  constructor(id, name, avatarId, position) {
    this.id = id;
    this.name = name;
    this.avatarId = avatarId;
    this.position = position;
    this.coins = 2;
    this.influence = []; // Array of card objects: { card: 'duke', revealed: false }
    this.isEliminated = false;
  }

  getAliveInfluenceCount() {
    return this.influence.filter(i => !i.revealed).length;
  }

  hasCard(card) {
    return this.influence.some(i => i.card === card && !i.revealed);
  }

  revealCard(cardIndex) {
    if (this.influence[cardIndex] && !this.influence[cardIndex].revealed) {
      this.influence[cardIndex].revealed = true;
      if (this.getAliveInfluenceCount() === 0) {
        this.isEliminated = true;
      }
      return this.influence[cardIndex].card;
    }
    return null;
  }

  revealCardByType(cardType) {
    const index = this.influence.findIndex(i => i.card === cardType && !i.revealed);
    if (index !== -1) {
      return this.revealCard(index);
    }
    return null;
  }

  removeCard(cardIndex) {
    if (this.influence[cardIndex] && !this.influence[cardIndex].revealed) {
      const card = this.influence[cardIndex].card;
      this.influence.splice(cardIndex, 1);
      return card;
    }
    return null;
  }

  addCard(card) {
    this.influence.push({ card, revealed: false });
  }

  getPublicState() {
    return {
      id: this.id,
      name: this.name,
      avatarId: this.avatarId,
      position: this.position,
      coins: this.coins,
      influenceCount: this.getAliveInfluenceCount(),
      revealedCards: this.influence.filter(i => i.revealed).map(i => i.card),
      isEliminated: this.isEliminated
    };
  }

  getPrivateState() {
    return {
      ...this.getPublicState(),
      influence: this.influence.map(i => ({
        card: i.card,
        revealed: i.revealed
      }))
    };
  }
}

export class Game {
  constructor(lobbyId, playerData) {
    this.id = lobbyId;
    this.players = [];
    this.deck = [];
    this.discardPile = [];
    this.currentPlayerIndex = 0;
    this.phase = GAME_PHASES.ACTION_DECLARATION;
    this.turnNumber = 1;
    this.winner = null;
    
    // Current action state
    this.currentAction = null;
    this.currentTarget = null;
    this.claimedCard = null;
    
    // Block state
    this.blockingPlayer = null;
    this.blockingCard = null;
    
    // Challenge state
    this.challengingPlayer = null;
    this.challengeResult = null;
    
    // Exchange state
    this.exchangeCards = [];
    
    // Player waiting to select influence to lose
    this.playerSelectingInfluence = null;
    this.pendingInfluenceLoss = []; // Queue for multiple influence losses (double danger)
    
    // Tracking who has responded
    this.playersAllowed = new Set();
    
    // Timer reference
    this.actionTimer = null;
    this.timerDuration = 15000; // 15 seconds to respond
    
    // Game log
    this.gameLog = [];

    // Initialize game
    this.initializeDeck();
    this.initializePlayers(playerData);
    this.dealCards();
    
    this.addToLog(`Game started with ${this.players.length} players`);
  }

  initializeDeck() {
    this.deck = [];
    Object.values(CHARACTERS).forEach(character => {
      for (let i = 0; i < 3; i++) {
        this.deck.push(character);
      }
    });
    this.shuffleDeck();
  }

  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  initializePlayers(playerData) {
    playerData.forEach((data, index) => {
      this.players.push(new Player(data.id, data.name, data.avatarId, index));
    });
    
    // Randomize turn order
    for (let i = this.players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.players[i], this.players[j]] = [this.players[j], this.players[i]];
    }
    
    // Update positions after shuffle
    this.players.forEach((player, index) => {
      player.position = index;
    });
  }

  dealCards() {
    this.players.forEach(player => {
      player.addCard(this.deck.pop());
      player.addCard(this.deck.pop());
    });
  }

  drawCard() {
    if (this.deck.length === 0) {
      // Shuffle discard pile back into deck
      this.deck = [...this.discardPile];
      this.discardPile = [];
      this.shuffleDeck();
    }
    return this.deck.pop();
  }

  returnCardToDeck(card) {
    this.deck.push(card);
    this.shuffleDeck();
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  getPlayer(playerId) {
    return this.players.find(p => p.id === playerId);
  }

  getAlivePlayers() {
    return this.players.filter(p => !p.isEliminated);
  }

  addToLog(message, type = 'info') {
    this.gameLog.push({
      message,
      type,
      timestamp: Date.now(),
      turn: this.turnNumber
    });
  }

  nextTurn() {
    // Clear action state
    this.currentAction = null;
    this.currentTarget = null;
    this.claimedCard = null;
    this.blockingPlayer = null;
    this.blockingCard = null;
    this.challengingPlayer = null;
    this.challengeResult = null;
    this.exchangeCards = [];
    this.playersAllowed.clear();
    
    // Find next alive player
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.players[this.currentPlayerIndex].isEliminated);
    
    this.turnNumber++;
    this.phase = GAME_PHASES.ACTION_DECLARATION;
    
    // Check for winner
    const alivePlayers = this.getAlivePlayers();
    if (alivePlayers.length === 1) {
      this.winner = alivePlayers[0];
      this.phase = GAME_PHASES.GAME_OVER;
      this.addToLog(`${this.winner.name} wins the game!`, 'victory');
    }
    
    // Check 10 coin rule
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer.coins >= 10) {
      this.addToLog(`${currentPlayer.name} has 10+ coins and must Coup!`, 'warning');
    }
  }

  // Check if action is valid
  validateAction(playerId, action, targetId) {
    const player = this.getPlayer(playerId);
    const currentPlayer = this.getCurrentPlayer();
    
    if (!player) {
      return { valid: false, error: 'Player not found' };
    }
    
    if (player.id !== currentPlayer.id) {
      return { valid: false, error: 'Not your turn' };
    }
    
    if (player.isEliminated) {
      return { valid: false, error: 'You are eliminated' };
    }
    
    if (this.phase !== GAME_PHASES.ACTION_DECLARATION) {
      return { valid: false, error: 'Cannot perform action in current phase' };
    }
    
    const actionInfo = ACTION_INFO[action];
    if (!actionInfo) {
      return { valid: false, error: 'Invalid action' };
    }
    
    // Check 10 coin rule
    if (player.coins >= 10 && action !== ACTIONS.COUP) {
      return { valid: false, error: 'You have 10+ coins and must Coup!' };
    }
    
    // Check cost
    if (player.coins < actionInfo.cost) {
      return { valid: false, error: `Not enough coins. Need ${actionInfo.cost}` };
    }
    
    // Check target
    if (actionInfo.requiresTarget) {
      if (!targetId) {
        return { valid: false, error: 'This action requires a target' };
      }
      
      const target = this.getPlayer(targetId);
      if (!target || target.isEliminated) {
        return { valid: false, error: 'Invalid target' };
      }
      
      if (targetId === playerId) {
        return { valid: false, error: 'Cannot target yourself' };
      }
      
      // Special case for steal - target must have coins
      if (action === ACTIONS.STEAL && target.coins === 0) {
        return { valid: false, error: 'Target has no coins to steal' };
      }
    }
    
    return { valid: true };
  }

  // Process the declared action
  declareAction(playerId, action, targetId) {
    const validation = this.validateAction(playerId, action, targetId);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }
    
    const player = this.getPlayer(playerId);
    const actionInfo = ACTION_INFO[action];
    
    this.currentAction = action;
    this.currentTarget = targetId;
    this.claimedCard = actionInfo.requiresCharacter;
    
    // Pay cost immediately for Assassinate and Coup
    if (actionInfo.cost > 0) {
      player.coins -= actionInfo.cost;
    }
    
    // Build log message
    let logMessage = `${player.name} `;
    if (action === ACTIONS.INCOME) {
      logMessage += 'takes Income';
    } else if (action === ACTIONS.FOREIGN_AID) {
      logMessage += 'takes Foreign Aid';
    } else if (action === ACTIONS.COUP) {
      const target = this.getPlayer(targetId);
      logMessage += `launches a Coup against ${target.name}`;
    } else if (action === ACTIONS.TAX) {
      logMessage += 'claims Duke for Tax';
    } else if (action === ACTIONS.ASSASSINATE) {
      const target = this.getPlayer(targetId);
      logMessage += `claims Assassin to assassinate ${target.name}`;
    } else if (action === ACTIONS.STEAL) {
      const target = this.getPlayer(targetId);
      logMessage += `claims Captain to steal from ${target.name}`;
    } else if (action === ACTIONS.EXCHANGE) {
      logMessage += 'claims Ambassador to Exchange';
    }
    this.addToLog(logMessage, 'action');
    
    // Determine next phase based on action
    if (!actionInfo.canBeChallenged && !actionInfo.canBeBlocked) {
      // Income and Coup resolve immediately
      this.resolveAction();
    } else if (actionInfo.canBeChallenged) {
      // Actions that can be challenged
      this.phase = GAME_PHASES.AWAITING_CHALLENGE;
    } else if (actionInfo.canBeBlocked) {
      // Foreign Aid can only be blocked, not challenged
      this.phase = GAME_PHASES.AWAITING_BLOCK;
    }
    
    return { success: true };
  }

  // Handle a challenge to the current action
  processChallenge(challengerId) {
    const challenger = this.getPlayer(challengerId);
    const actingPlayer = this.getCurrentPlayer();
    
    if (!challenger || challenger.isEliminated) {
      return { success: false, error: 'Invalid challenger' };
    }
    
    // In AWAITING_CHALLENGE phase, the acting player cannot challenge their own action
    // In AWAITING_BLOCK_CHALLENGE phase, the acting player CAN challenge the blocker
    if (this.phase === GAME_PHASES.AWAITING_CHALLENGE && challenger.id === actingPlayer.id) {
      return { success: false, error: 'Cannot challenge yourself' };
    }
    
    if (this.phase !== GAME_PHASES.AWAITING_CHALLENGE && this.phase !== GAME_PHASES.AWAITING_BLOCK_CHALLENGE) {
      return { success: false, error: 'Cannot challenge in current phase' };
    }
    
    // In AWAITING_BLOCK_CHALLENGE, blocker cannot challenge their own block
    if (this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE && challenger.id === this.blockingPlayer) {
      return { success: false, error: 'Blocker cannot challenge their own block' };
    }
    
    this.challengingPlayer = challengerId;
    
    // Check if the challenged player actually has the card
    let challengedPlayer, claimedCard;
    
    if (this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE) {
      // Challenging a block
      challengedPlayer = this.getPlayer(this.blockingPlayer);
      claimedCard = this.blockingCard;
      this.addToLog(`${challenger.name} challenges ${challengedPlayer.name}'s ${claimedCard}`, 'challenge');
    } else {
      // Challenging the action
      challengedPlayer = actingPlayer;
      claimedCard = this.claimedCard;
      this.addToLog(`${challenger.name} challenges ${actingPlayer.name}'s ${claimedCard}`, 'challenge');
    }
    
    if (challengedPlayer.hasCard(claimedCard)) {
      // Challenge failed - challenger loses influence
      this.challengeResult = {
        winner: challengedPlayer.id,
        loser: challengerId,
        revealedCard: claimedCard,
        challengeSuccess: false
      };
      
      // Challenged player shows card, returns it to deck, draws new one
      challengedPlayer.revealCardByType(claimedCard);
      this.returnCardToDeck(claimedCard);
      const newCard = this.drawCard();
      challengedPlayer.addCard(newCard);
      
      // Fix the influence array - remove the revealed entry and keep the new one
      challengedPlayer.influence = challengedPlayer.influence.filter(i => !i.revealed);
      
      this.addToLog(`${challengedPlayer.name} reveals ${claimedCard}! ${challenger.name} loses influence`, 'challenge');
      
      // Challenger must choose which influence to lose
      this.playerSelectingInfluence = challengerId;
      this.phase = this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE 
        ? GAME_PHASES.RESOLVING_BLOCK_CHALLENGE 
        : GAME_PHASES.RESOLVING_CHALLENGE;
        
    } else {
      // Challenge succeeded - challenged player loses influence
      this.challengeResult = {
        winner: challengerId,
        loser: challengedPlayer.id,
        revealedCard: null,
        challengeSuccess: true
      };
      
      this.addToLog(`${challengedPlayer.name} cannot reveal ${claimedCard}! ${challengedPlayer.name} loses influence`, 'challenge');
      
      // Challenged player must choose which influence to lose
      this.playerSelectingInfluence = challengedPlayer.id;
      this.phase = this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE 
        ? GAME_PHASES.RESOLVING_BLOCK_CHALLENGE 
        : GAME_PHASES.RESOLVING_CHALLENGE;
    }
    
    return { success: true };
  }

  // Handle a block attempt
  processBlock(blockerId, claimedCard) {
    const blocker = this.getPlayer(blockerId);
    const actionInfo = ACTION_INFO[this.currentAction];
    
    if (!blocker || blocker.isEliminated) {
      return { success: false, error: 'Invalid blocker' };
    }
    
    if (this.phase !== GAME_PHASES.AWAITING_CHALLENGE && this.phase !== GAME_PHASES.AWAITING_BLOCK) {
      return { success: false, error: 'Cannot block in current phase' };
    }
    
    if (!actionInfo.canBeBlocked) {
      return { success: false, error: 'This action cannot be blocked' };
    }
    
    if (!actionInfo.blockedBy.includes(claimedCard)) {
      return { success: false, error: `${claimedCard} cannot block this action` };
    }
    
    // For targeted actions, only the target can block (except Foreign Aid which anyone can block with Duke)
    if (actionInfo.requiresTarget && this.currentTarget !== blockerId) {
      return { success: false, error: 'Only the target can block this action' };
    }
    
    this.blockingPlayer = blockerId;
    this.blockingCard = claimedCard;
    
    this.addToLog(`${blocker.name} claims ${claimedCard} to block`, 'block');
    
    // Block can be challenged
    this.phase = GAME_PHASES.AWAITING_BLOCK_CHALLENGE;
    this.playersAllowed.clear();
    
    return { success: true };
  }

  // Check if a player can allow the current action/block
  canPlayerAllow(playerId) {
    const player = this.getPlayer(playerId);
    
    if (!player || player.isEliminated) return false;
    if (this.playersAllowed.has(playerId)) return false;
    
    const actionInfo = ACTION_INFO[this.currentAction];
    
    if (this.phase === GAME_PHASES.AWAITING_CHALLENGE) {
      // All players except acting player can allow during challenge phase
      if (playerId === this.getCurrentPlayer()?.id) return false;
      return actionInfo?.canBeChallenged === true;
    }
    
    if (this.phase === GAME_PHASES.AWAITING_BLOCK) {
      // For Foreign Aid: All players except current can respond
      // For targeted actions: Only target can respond
      if (playerId === this.getCurrentPlayer()?.id) return false;
      if (this.currentAction === ACTIONS.FOREIGN_AID) {
        return true;
      }
      if (actionInfo?.requiresTarget) {
        return this.currentTarget === playerId;
      }
      return false;
    }
    
    if (this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE) {
      // All players except blocker can allow (INCLUDING the current player whose action is being blocked)
      return playerId !== this.blockingPlayer;
    }
    
    return false;
  }

  // Get list of players who need to respond in current phase
  getPlayersWhoNeedToRespond() {
    const alivePlayers = this.getAlivePlayers();
    const currentPlayerId = this.getCurrentPlayer()?.id;
    const actionInfo = ACTION_INFO[this.currentAction];
    
    if (this.phase === GAME_PHASES.AWAITING_CHALLENGE) {
      // All alive players except current player
      return alivePlayers.filter(p => p.id !== currentPlayerId);
    }
    
    if (this.phase === GAME_PHASES.AWAITING_BLOCK) {
      // For Foreign Aid: All players except current
      // For targeted actions: Only the target
      if (this.currentAction === ACTIONS.FOREIGN_AID) {
        return alivePlayers.filter(p => p.id !== currentPlayerId);
      }
      if (actionInfo?.requiresTarget && this.currentTarget) {
        const target = this.getPlayer(this.currentTarget);
        return target && !target.isEliminated ? [target] : [];
      }
      return [];
    }
    
    if (this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE) {
      // All alive players except blocker (current player CAN challenge/allow a block against their action)
      return alivePlayers.filter(p => p.id !== this.blockingPlayer);
    }
    
    return [];
  }

  // Handle allowing an action (not challenging or blocking)
  processAllow(playerId) {
    const player = this.getPlayer(playerId);
    
    if (!player || player.isEliminated) {
      return { success: false, error: 'Invalid player' };
    }
    
    // Current player can only allow during AWAITING_BLOCK_CHALLENGE (to allow a block against their action)
    if (player.id === this.getCurrentPlayer().id && this.phase !== GAME_PHASES.AWAITING_BLOCK_CHALLENGE) {
      return { success: false, error: 'Current player cannot allow' };
    }
    
    // Verify this player can allow in current phase
    if (!this.canPlayerAllow(playerId)) {
      return { success: false, error: 'You cannot allow in this phase' };
    }
    
    this.playersAllowed.add(playerId);
    
    // Use the new method to get correct list of players who need to respond
    const playersWhoNeedToRespond = this.getPlayersWhoNeedToRespond();
    const allAllowed = playersWhoNeedToRespond.every(p => this.playersAllowed.has(p.id));
    
    if (allAllowed) {
      if (this.phase === GAME_PHASES.AWAITING_CHALLENGE) {
        // Action not challenged, check if it can be blocked
        const actionInfo = ACTION_INFO[this.currentAction];
        if (actionInfo.canBeBlocked) {
          this.phase = GAME_PHASES.AWAITING_BLOCK;
          this.playersAllowed.clear();
        } else {
          this.resolveAction();
        }
      } else if (this.phase === GAME_PHASES.AWAITING_BLOCK) {
        // No one blocked, resolve action
        this.resolveAction();
      } else if (this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE) {
        // Block not challenged, action is blocked
        this.addToLog(`Block successful! Action cancelled.`, 'block');
        this.nextTurn();
      }
    }
    
    return { success: true };
  }

  // Handle influence selection after a challenge or assassination
  processInfluenceSelection(playerId, cardIndex) {
    if (this.playerSelectingInfluence !== playerId) {
      return { success: false, error: 'Not your turn to select influence' };
    }
    
    const player = this.getPlayer(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }
    
    const influence = player.influence[cardIndex];
    if (!influence || influence.revealed) {
      return { success: false, error: 'Invalid card selection' };
    }
    
    // Reveal the selected card
    player.revealCard(cardIndex);
    this.addToLog(`${player.name} loses influence (${influence.card})`, 'influence');
    
    // Check for elimination
    if (player.isEliminated) {
      this.addToLog(`${player.name} has been eliminated!`, 'elimination');
    }
    
    this.playerSelectingInfluence = null;
    
    // Check for pending influence losses (double danger)
    if (this.pendingInfluenceLoss.length > 0) {
      const nextLoss = this.pendingInfluenceLoss.shift();
      this.playerSelectingInfluence = nextLoss.playerId;
      return { success: true };
    }
    
    // Determine what happens next based on phase
    if (this.phase === GAME_PHASES.RESOLVING_CHALLENGE) {
      // After challenge resolution
      if (this.challengeResult.challengeSuccess) {
        // Challenge was successful, action fails
        // Refund cost if any (except Assassinate - coins are spent)
        this.nextTurn();
      } else {
        // Challenge failed, action continues
        const actionInfo = ACTION_INFO[this.currentAction];
        if (actionInfo.canBeBlocked) {
          this.phase = GAME_PHASES.AWAITING_BLOCK;
          this.playersAllowed.clear();
        } else {
          this.resolveAction();
        }
      }
    } else if (this.phase === GAME_PHASES.RESOLVING_BLOCK_CHALLENGE) {
      if (this.challengeResult.challengeSuccess) {
        // Block challenge succeeded, blocker was lying
        // Original action goes through
        this.resolveAction();
      } else {
        // Block challenge failed, block stands
        this.nextTurn();
      }
    } else if (this.phase === GAME_PHASES.SELECTING_INFLUENCE_TO_LOSE) {
      // After Coup or Assassination
      this.nextTurn();
    }
    
    // Check for winner after elimination
    const alivePlayers = this.getAlivePlayers();
    if (alivePlayers.length === 1) {
      this.winner = alivePlayers[0];
      this.phase = GAME_PHASES.GAME_OVER;
      this.addToLog(`${this.winner.name} wins the game!`, 'victory');
    }
    
    return { success: true };
  }

  // Resolve the current action
  resolveAction() {
    const player = this.getCurrentPlayer();
    const actionInfo = ACTION_INFO[this.currentAction];
    
    switch (this.currentAction) {
      case ACTIONS.INCOME:
        player.coins += 1;
        this.addToLog(`${player.name} takes 1 coin (Income)`, 'action');
        this.nextTurn();
        break;
        
      case ACTIONS.FOREIGN_AID:
        player.coins += 2;
        this.addToLog(`${player.name} takes 2 coins (Foreign Aid)`, 'action');
        this.nextTurn();
        break;
        
      case ACTIONS.TAX:
        player.coins += 3;
        this.addToLog(`${player.name} takes 3 coins (Tax)`, 'action');
        this.nextTurn();
        break;
        
      case ACTIONS.STEAL: {
        const target = this.getPlayer(this.currentTarget);
        const stolenAmount = Math.min(2, target.coins);
        target.coins -= stolenAmount;
        player.coins += stolenAmount;
        this.addToLog(`${player.name} steals ${stolenAmount} coins from ${target.name}`, 'action');
        this.nextTurn();
        break;
      }
        
      case ACTIONS.COUP: {
        const target = this.getPlayer(this.currentTarget);
        this.addToLog(`${player.name}'s Coup hits ${target.name}`, 'action');
        
        if (target.getAliveInfluenceCount() === 1) {
          // Auto-reveal last card
          const lastCardIndex = target.influence.findIndex(i => !i.revealed);
          target.revealCard(lastCardIndex);
          this.addToLog(`${target.name} loses their last influence and is eliminated!`, 'elimination');
          this.nextTurn();
        } else {
          this.playerSelectingInfluence = target.id;
          this.phase = GAME_PHASES.SELECTING_INFLUENCE_TO_LOSE;
        }
        break;
      }
        
      case ACTIONS.ASSASSINATE: {
        const target = this.getPlayer(this.currentTarget);
        this.addToLog(`${player.name}'s Assassination hits ${target.name}`, 'action');
        
        if (target.getAliveInfluenceCount() === 1) {
          // Auto-reveal last card
          const lastCardIndex = target.influence.findIndex(i => !i.revealed);
          target.revealCard(lastCardIndex);
          this.addToLog(`${target.name} loses their last influence and is eliminated!`, 'elimination');
          this.nextTurn();
        } else {
          this.playerSelectingInfluence = target.id;
          this.phase = GAME_PHASES.SELECTING_INFLUENCE_TO_LOSE;
        }
        break;
      }
        
      case ACTIONS.EXCHANGE: {
        // Draw 2 cards for exchange
        this.exchangeCards = [this.drawCard(), this.drawCard()];
        this.phase = GAME_PHASES.EXCHANGING_CARDS;
        this.addToLog(`${player.name} draws cards for Exchange`, 'action');
        break;
      }
    }
  }

  // Handle exchange card selection
  processExchange(playerId, selectedCardIndices) {
    const player = this.getPlayer(playerId);
    
    if (player.id !== this.getCurrentPlayer().id) {
      return { success: false, error: 'Not your turn' };
    }
    
    if (this.phase !== GAME_PHASES.EXCHANGING_CARDS) {
      return { success: false, error: 'Not in exchange phase' };
    }
    
    // Player has their cards + 2 exchange cards
    // They must select which cards to keep (equal to their current alive influence count)
    const aliveCount = player.getAliveInfluenceCount();
    
    if (selectedCardIndices.length !== aliveCount) {
      return { success: false, error: `Must select exactly ${aliveCount} cards to keep` };
    }
    
    // Build available cards pool (hand + exchange cards)
    const availableCards = [
      ...player.influence.filter(i => !i.revealed).map(i => i.card),
      ...this.exchangeCards
    ];
    
    // Validate selection indices
    if (selectedCardIndices.some(i => i < 0 || i >= availableCards.length)) {
      return { success: false, error: 'Invalid card selection' };
    }
    
    // Get selected cards
    const selectedCards = selectedCardIndices.map(i => availableCards[i]);
    const returnedCards = availableCards.filter((_, i) => !selectedCardIndices.includes(i));
    
    // Update player's hand
    player.influence = player.influence.filter(i => i.revealed); // Keep revealed cards
    selectedCards.forEach(card => player.addCard(card));
    
    // Return cards to deck
    returnedCards.forEach(card => this.returnCardToDeck(card));
    
    this.exchangeCards = [];
    this.addToLog(`${player.name} completes Exchange`, 'action');
    this.nextTurn();
    
    return { success: true };
  }

  // Get game state for a specific player (hides other players' cards)
  getStateForPlayer(playerId) {
    const player = this.getPlayer(playerId);
    
    // Build players array with appropriate visibility
    const playersState = this.players.map(p => {
      if (p.id === playerId) {
        return p.getPrivateState();
      }
      return p.getPublicState();
    });
    
    // Determine available actions for the current player
    let availableActions = [];
    if (this.phase === GAME_PHASES.ACTION_DECLARATION && 
        this.getCurrentPlayer().id === playerId) {
      availableActions = this.getAvailableActions(playerId);
    }
    
    // Get exchange cards if this player is exchanging
    let exchangeOptions = null;
    if (this.phase === GAME_PHASES.EXCHANGING_CARDS && 
        this.getCurrentPlayer().id === playerId) {
      const aliveInfluence = player.influence.filter(i => !i.revealed).map(i => i.card);
      exchangeOptions = {
        handCards: aliveInfluence,
        drawnCards: this.exchangeCards,
        mustSelect: player.getAliveInfluenceCount()
      };
    }
    
    // Check if player needs to select influence to lose
    const mustSelectInfluence = this.playerSelectingInfluence === playerId;
    
    // Check what responses are available
    let canChallenge = false;
    let canBlock = false;
    let blockOptions = [];
    
    if (player && !player.isEliminated) {
      const actionInfo = ACTION_INFO[this.currentAction];
      
      // CHALLENGE LOGIC:
      // 1. In AWAITING_CHALLENGE phase: Can challenge if action is challengeable (not current player)
      // 2. In AWAITING_BLOCK_CHALLENGE phase: Can challenge blocker (anyone except the blocker, INCLUDING the current player)
      if (this.phase === GAME_PHASES.AWAITING_CHALLENGE && 
          playerId !== this.getCurrentPlayer()?.id &&
          !this.playersAllowed.has(playerId) &&
          actionInfo?.canBeChallenged) {
        canChallenge = true;
      }
      
      if (this.phase === GAME_PHASES.AWAITING_BLOCK_CHALLENGE && 
          playerId !== this.blockingPlayer &&
          !this.playersAllowed.has(playerId)) {
        canChallenge = true;
      }
      
      // BLOCK LOGIC:
      // Blocking happens in AWAITING_BLOCK phase (after challenge window closes)
      // 1. Foreign Aid: ANY player can block with Duke
      // 2. Steal: ONLY the target can block with Captain or Ambassador  
      // 3. Assassinate: ONLY the target can block with Contessa
      if (this.phase === GAME_PHASES.AWAITING_BLOCK && !this.playersAllowed.has(playerId)) {
        if (actionInfo?.canBeBlocked) {
          if (this.currentAction === ACTIONS.FOREIGN_AID) {
            // Anyone can block Foreign Aid with Duke
            canBlock = true;
            blockOptions = [CHARACTERS.DUKE];
          } else if (actionInfo.requiresTarget && this.currentTarget === playerId) {
            // Only target can block targeted actions (Steal, Assassinate)
            canBlock = true;
            blockOptions = actionInfo.blockedBy;
          }
        }
      }
    }
    
    return {
      gameId: this.id,
      phase: this.phase,
      turnNumber: this.turnNumber,
      currentPlayerId: this.getCurrentPlayer()?.id,
      players: playersState,
      deckSize: this.deck.length,
      
      // Current action info
      currentAction: this.currentAction,
      currentTarget: this.currentTarget,
      claimedCard: this.claimedCard,
      
      // Block info
      blockingPlayer: this.blockingPlayer,
      blockingCard: this.blockingCard,
      
      // Challenge info
      challengingPlayer: this.challengingPlayer,
      challengeResult: this.challengeResult,
      
      // Player-specific info
      isYourTurn: this.getCurrentPlayer()?.id === playerId,
      availableActions,
      exchangeOptions,
      mustSelectInfluence,
      canChallenge,
      canBlock,
      blockOptions,
      canAllow: this.canPlayerAllow(playerId),
      
      // Game log (last 20 entries)
      gameLog: this.gameLog.slice(-20),
      
      // Winner
      winner: this.winner ? {
        id: this.winner.id,
        name: this.winner.name
      } : null
    };
  }

  getAvailableActions(playerId) {
    const player = this.getPlayer(playerId);
    if (!player || player.isEliminated) return [];
    
    const actions = [];
    const mustCoup = player.coins >= 10;
    
    // If must coup, only coup is available
    if (mustCoup) {
      return [{
        action: ACTIONS.COUP,
        ...ACTION_INFO[ACTIONS.COUP],
        requiresTarget: true,
        availableTargets: this.getAlivePlayers()
          .filter(p => p.id !== playerId)
          .map(p => ({ id: p.id, name: p.name }))
      }];
    }
    
    // Income - always available
    actions.push({
      action: ACTIONS.INCOME,
      ...ACTION_INFO[ACTIONS.INCOME]
    });
    
    // Foreign Aid - always available
    actions.push({
      action: ACTIONS.FOREIGN_AID,
      ...ACTION_INFO[ACTIONS.FOREIGN_AID]
    });
    
    // Coup - if can afford
    if (player.coins >= 7) {
      actions.push({
        action: ACTIONS.COUP,
        ...ACTION_INFO[ACTIONS.COUP],
        availableTargets: this.getAlivePlayers()
          .filter(p => p.id !== playerId)
          .map(p => ({ id: p.id, name: p.name }))
      });
    }
    
    // Tax (Duke) - always available to claim
    actions.push({
      action: ACTIONS.TAX,
      ...ACTION_INFO[ACTIONS.TAX]
    });
    
    // Assassinate - if can afford
    if (player.coins >= 3) {
      actions.push({
        action: ACTIONS.ASSASSINATE,
        ...ACTION_INFO[ACTIONS.ASSASSINATE],
        availableTargets: this.getAlivePlayers()
          .filter(p => p.id !== playerId)
          .map(p => ({ id: p.id, name: p.name }))
      });
    }
    
    // Steal (Captain) - if targets available
    const stealTargets = this.getAlivePlayers()
      .filter(p => p.id !== playerId && p.coins > 0);
    if (stealTargets.length > 0) {
      actions.push({
        action: ACTIONS.STEAL,
        ...ACTION_INFO[ACTIONS.STEAL],
        availableTargets: stealTargets.map(p => ({ id: p.id, name: p.name }))
      });
    }
    
    // Exchange (Ambassador) - always available
    actions.push({
      action: ACTIONS.EXCHANGE,
      ...ACTION_INFO[ACTIONS.EXCHANGE]
    });
    
    return actions;
  }
}
