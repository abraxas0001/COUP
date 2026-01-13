// Character definitions
export const CHARACTERS = {
  duke: {
    id: 'duke',
    name: 'Duke',
    action: 'tax',
    actionName: 'Tax',
    actionDescription: 'Take 3 coins from the Treasury',
    counteraction: 'Blocks Foreign Aid',
    canBlock: ['foreignAid'],
    color: '#9B59B6',
    gradient: 'from-purple-500 to-purple-700',
  },
  assassin: {
    id: 'assassin',
    name: 'Assassin',
    action: 'assassinate',
    actionName: 'Assassinate',
    actionDescription: 'Pay 3 coins to force a player to lose influence',
    counteraction: null,
    canBlock: [],
    color: '#2C3E50',
    gradient: 'from-gray-600 to-gray-800',
  },
  captain: {
    id: 'captain',
    name: 'Captain',
    action: 'steal',
    actionName: 'Steal',
    actionDescription: 'Take 2 coins from another player',
    counteraction: 'Blocks stealing',
    canBlock: ['steal'],
    color: '#3498DB',
    gradient: 'from-blue-500 to-blue-700',
  },
  ambassador: {
    id: 'ambassador',
    name: 'Ambassador',
    action: 'exchange',
    actionName: 'Exchange',
    actionDescription: 'Draw 2 cards, return 2 to the deck',
    counteraction: 'Blocks stealing',
    canBlock: ['steal'],
    color: '#27AE60',
    gradient: 'from-green-500 to-green-700',
  },
  contessa: {
    id: 'contessa',
    name: 'Contessa',
    action: null,
    actionName: null,
    actionDescription: null,
    counteraction: 'Blocks assassination',
    canBlock: ['assassinate'],
    color: '#E74C3C',
    gradient: 'from-red-500 to-red-700',
  },
}

// Action definitions
export const ACTIONS = {
  income: {
    id: 'income',
    name: 'Income',
    description: 'Take 1 coin from the Treasury',
    cost: 0,
    requiresTarget: false,
    requiresCharacter: null,
    canBeBlocked: false,
    canBeChallenged: false,
    icon: 'Coins',
  },
  foreignAid: {
    id: 'foreignAid',
    name: 'Foreign Aid',
    description: 'Take 2 coins from the Treasury',
    cost: 0,
    requiresTarget: false,
    requiresCharacter: null,
    canBeBlocked: true,
    canBeChallenged: false,
    blockedBy: ['duke'],
    icon: 'HandCoins',
  },
  coup: {
    id: 'coup',
    name: 'Coup',
    description: 'Pay 7 coins to force a player to lose influence',
    cost: 7,
    requiresTarget: true,
    requiresCharacter: null,
    canBeBlocked: false,
    canBeChallenged: false,
    icon: 'Sword',
  },
  tax: {
    id: 'tax',
    name: 'Tax',
    description: 'Take 3 coins from the Treasury',
    cost: 0,
    requiresTarget: false,
    requiresCharacter: 'duke',
    canBeBlocked: false,
    canBeChallenged: true,
    icon: 'Crown',
  },
  assassinate: {
    id: 'assassinate',
    name: 'Assassinate',
    description: 'Pay 3 coins to force a player to lose influence',
    cost: 3,
    requiresTarget: true,
    requiresCharacter: 'assassin',
    canBeBlocked: true,
    canBeChallenged: true,
    blockedBy: ['contessa'],
    icon: 'Skull',
  },
  steal: {
    id: 'steal',
    name: 'Steal',
    description: 'Take 2 coins from another player',
    cost: 0,
    requiresTarget: true,
    requiresCharacter: 'captain',
    canBeBlocked: true,
    canBeChallenged: true,
    blockedBy: ['captain', 'ambassador'],
    icon: 'HandGrabbing',
  },
  exchange: {
    id: 'exchange',
    name: 'Exchange',
    description: 'Draw 2 cards from the Court Deck, choose which to keep',
    cost: 0,
    requiresTarget: false,
    requiresCharacter: 'ambassador',
    canBeBlocked: false,
    canBeChallenged: true,
    icon: 'ArrowLeftRight',
  },
}

// Game phases
export const GAME_PHASES = {
  actionDeclaration: {
    id: 'actionDeclaration',
    name: 'Action Phase',
    description: 'Choose your action',
  },
  awaitingChallenge: {
    id: 'awaitingChallenge',
    name: 'Challenge Window',
    description: 'Players may challenge the action',
  },
  awaitingBlock: {
    id: 'awaitingBlock',
    name: 'Block Window',
    description: 'Target may block the action',
  },
  awaitingBlockChallenge: {
    id: 'awaitingBlockChallenge',
    name: 'Block Challenge Window',
    description: 'Players may challenge the block',
  },
  resolvingChallenge: {
    id: 'resolvingChallenge',
    name: 'Resolving Challenge',
    description: 'Challenge being resolved',
  },
  resolvingBlockChallenge: {
    id: 'resolvingBlockChallenge',
    name: 'Resolving Block Challenge',
    description: 'Block challenge being resolved',
  },
  selectingInfluenceToLose: {
    id: 'selectingInfluenceToLose',
    name: 'Losing Influence',
    description: 'Select a card to reveal',
  },
  exchangingCards: {
    id: 'exchangingCards',
    name: 'Exchanging Cards',
    description: 'Choose which cards to keep',
  },
  gameOver: {
    id: 'gameOver',
    name: 'Game Over',
    description: 'Game has ended',
  },
}

// Helper functions
export const getCharacterByAction = (action) => {
  return Object.values(CHARACTERS).find(c => c.action === action)
}

export const getCharacterById = (id) => {
  return CHARACTERS[id]
}

export const getActionById = (id) => {
  return ACTIONS[id]
}

export const getBlockingCharacters = (action) => {
  const actionInfo = ACTIONS[action]
  if (!actionInfo || !actionInfo.canBeBlocked) return []
  return actionInfo.blockedBy?.map(id => CHARACTERS[id]) || []
}
