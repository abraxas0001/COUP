// Card and Character Definitions
export const CHARACTERS = {
  DUKE: 'duke',
  ASSASSIN: 'assassin',
  CAPTAIN: 'captain',
  AMBASSADOR: 'ambassador',
  CONTESSA: 'contessa'
};

export const CHARACTER_INFO = {
  [CHARACTERS.DUKE]: {
    name: 'Duke',
    action: 'tax',
    actionDescription: 'Take 3 coins from the Treasury',
    counteraction: 'Blocks Foreign Aid',
    color: '#9B59B6'
  },
  [CHARACTERS.ASSASSIN]: {
    name: 'Assassin',
    action: 'assassinate',
    actionDescription: 'Pay 3 coins to force a player to lose influence',
    counteraction: null,
    color: '#2C3E50'
  },
  [CHARACTERS.CAPTAIN]: {
    name: 'Captain',
    action: 'steal',
    actionDescription: 'Take 2 coins from another player',
    counteraction: 'Blocks stealing',
    color: '#3498DB'
  },
  [CHARACTERS.AMBASSADOR]: {
    name: 'Ambassador',
    action: 'exchange',
    actionDescription: 'Draw 2 cards, return 2 cards to deck',
    counteraction: 'Blocks stealing',
    color: '#27AE60'
  },
  [CHARACTERS.CONTESSA]: {
    name: 'Contessa',
    action: null,
    actionDescription: null,
    counteraction: 'Blocks assassination',
    color: '#E74C3C'
  }
};

// Action Types
export const ACTIONS = {
  INCOME: 'income',
  FOREIGN_AID: 'foreignAid',
  COUP: 'coup',
  TAX: 'tax',
  ASSASSINATE: 'assassinate',
  STEAL: 'steal',
  EXCHANGE: 'exchange'
};

export const ACTION_INFO = {
  [ACTIONS.INCOME]: {
    name: 'Income',
    description: 'Take 1 coin from the Treasury',
    cost: 0,
    coinGain: 1,
    requiresTarget: false,
    requiresCharacter: null,
    canBeBlocked: false,
    canBeChallenged: false,
    blockedBy: []
  },
  [ACTIONS.FOREIGN_AID]: {
    name: 'Foreign Aid',
    description: 'Take 2 coins from the Treasury',
    cost: 0,
    coinGain: 2,
    requiresTarget: false,
    requiresCharacter: null,
    canBeBlocked: true,
    canBeChallenged: false,
    blockedBy: [CHARACTERS.DUKE]
  },
  [ACTIONS.COUP]: {
    name: 'Coup',
    description: 'Pay 7 coins to force a player to lose influence',
    cost: 7,
    coinGain: 0,
    requiresTarget: true,
    requiresCharacter: null,
    canBeBlocked: false,
    canBeChallenged: false,
    blockedBy: []
  },
  [ACTIONS.TAX]: {
    name: 'Tax',
    description: 'Take 3 coins from the Treasury',
    cost: 0,
    coinGain: 3,
    requiresTarget: false,
    requiresCharacter: CHARACTERS.DUKE,
    canBeBlocked: false,
    canBeChallenged: true,
    blockedBy: []
  },
  [ACTIONS.ASSASSINATE]: {
    name: 'Assassinate',
    description: 'Pay 3 coins to force a player to lose influence',
    cost: 3,
    coinGain: 0,
    requiresTarget: true,
    requiresCharacter: CHARACTERS.ASSASSIN,
    canBeBlocked: true,
    canBeChallenged: true,
    blockedBy: [CHARACTERS.CONTESSA]
  },
  [ACTIONS.STEAL]: {
    name: 'Steal',
    description: 'Take 2 coins from another player',
    cost: 0,
    coinGain: 2,
    requiresTarget: true,
    requiresCharacter: CHARACTERS.CAPTAIN,
    canBeBlocked: true,
    canBeChallenged: true,
    blockedBy: [CHARACTERS.CAPTAIN, CHARACTERS.AMBASSADOR]
  },
  [ACTIONS.EXCHANGE]: {
    name: 'Exchange',
    description: 'Draw 2 cards from the Court Deck, choose which to keep',
    cost: 0,
    coinGain: 0,
    requiresTarget: false,
    requiresCharacter: CHARACTERS.AMBASSADOR,
    canBeBlocked: false,
    canBeChallenged: true,
    blockedBy: []
  }
};

// Game Phase States
export const GAME_PHASES = {
  // Pre-game
  WAITING: 'waiting',
  
  // Normal turn flow
  ACTION_DECLARATION: 'actionDeclaration',
  AWAITING_CHALLENGE: 'awaitingChallenge',
  AWAITING_BLOCK: 'awaitingBlock',
  AWAITING_BLOCK_CHALLENGE: 'awaitingBlockChallenge',
  
  // Resolution phases
  RESOLVING_CHALLENGE: 'resolvingChallenge',
  RESOLVING_BLOCK_CHALLENGE: 'resolvingBlockChallenge',
  SELECTING_INFLUENCE_TO_LOSE: 'selectingInfluenceToLose',
  EXCHANGING_CARDS: 'exchangingCards',
  
  // Action resolution
  RESOLVING_ACTION: 'resolvingAction',
  
  // Game end
  GAME_OVER: 'gameOver'
};
