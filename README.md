# COUP - The Digital Bluffing Game

<p align="center">
  <img src="client/public/favicon.svg" alt="COUP Logo" width="100">
</p>

<p align="center">
  <strong>A real-time multiplayer web adaptation of the classic social deduction card game COUP</strong>
</p>

<p align="center">
  <em>Deceive • Manipulate • Survive</em>
</p>

---

## 🎮 Features

- **Real-time Multiplayer**: Play with 2-6 friends online
- **Create & Join Parties**: Simple 6-character room codes
- **Complete Game Logic**: Full implementation of all Coup rules
- **Interactive Tutorial**: Learn to play with the built-in How to Play guide
- **Beautiful UI**: Clean, elegant dark theme with gold accents
- **Responsive Design**: Works on desktop and tablet devices
- **Game Log**: Track all actions and events during gameplay

## 📋 Game Overview

### The Goal
Be the last player with Influence. Eliminate all other players by forcing them to lose their influence cards.

### Setup
- Each player starts with **2 Coins** and **2 Influence Cards** (face-down)
- The Court Deck contains **15 cards** (3 copies of each character)

### Characters

| Character | Action | Effect | Counteraction |
|-----------|--------|--------|---------------|
| **Duke** | Tax | Take 3 coins | Blocks Foreign Aid |
| **Assassin** | Assassinate | Pay 3 coins, target loses influence | — |
| **Captain** | Steal | Take 2 coins from another player | Blocks Stealing |
| **Ambassador** | Exchange | Draw 2 cards, return 2 to deck | Blocks Stealing |
| **Contessa** | — | — | Blocks Assassination |

### General Actions (No character required)

| Action | Effect | Notes |
|--------|--------|-------|
| **Income** | Take 1 coin | Cannot be blocked or challenged |
| **Foreign Aid** | Take 2 coins | Can be blocked by Duke |
| **Coup** | Pay 7 coins, target loses influence | Cannot be blocked or challenged |

### The Golden Rule 🎭
**You can perform ANY character action, even if you don't have that character card!**

- If no one challenges → Your action succeeds
- If challenged and you're bluffing → You lose an influence
- If challenged and you have the card → The challenger loses an influence

### Critical Rule ⚠️
**If you start your turn with 10+ coins, you MUST Coup!**

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd coup

# Install all dependencies (server + client)
npm run install-all
```

### Development

```bash
# Run both server and client in development mode
npm run dev
```

- **Server**: http://localhost:3001
- **Client**: http://localhost:5173

### Production Build

```bash
# Build the client
npm run build

# Start the production server
npm start
```

---

## 🏗️ Project Structure

```
coup/
├── server/                    # Backend Node.js server
│   ├── index.js              # Express + Socket.io server
│   └── game/
│       ├── constants.js      # Game constants & definitions
│       ├── Game.js           # Core game state machine
│       ├── GameManager.js    # Manages multiple games
│       └── LobbyManager.js   # Handles party/lobby logic

**Alternate Client**: https://coup-multi.vercel.app
**Render Link**: [add your Render deployment link here]
│   │   └── cards/            # Character card SVGs
│   ├── src/
│   │   ├── components/
│   │   │   ├── game/         # Game-specific components
│   │   │   │   ├── GameTable.jsx
│   │   │   │   ├── PlayerHand.jsx
│   │   │   │   ├── ActionPanel.jsx
│   │   │   │   ├── ResponsePanel.jsx
│   │   │   │   ├── GameLog.jsx
│   │   │   │   ├── ExchangeModal.jsx
│   │   │   │   ├── InfluenceLossModal.jsx
│   │   │   │   ├── GameOverModal.jsx
│   │   │   │   └── PhaseIndicator.jsx
│   │   │   ├── Avatar.jsx
│   │   │   ├── AvatarSelector.jsx
│   │   │   ├── CharacterCard.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ParticleBackground.jsx
│   │   ├── constants/
│   │   │   └── gameConstants.js
│   │   ├── pages/
│   │   │   ├── Home.jsx      # Landing page
│   │   │   ├── Lobby.jsx     # Party waiting room
│   │   │   ├── Game.jsx      # Main game view
│   │   │   └── HowToPlay.jsx # Interactive tutorial
│   │   ├── store/
│   │   │   └── gameStore.js  # Zustand state management
│   │   ├── utils/
│   │   │   └── confetti.js   # Victory celebration
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json               # Root package.json
└── README.md
```

---

## 🎯 Game Flow

### Turn Sequence

1. **Action Declaration**: Current player chooses an action
2. **Challenge Window**: Other players may challenge the action
3. **Block Window**: Target may attempt to block (if applicable)
4. **Block Challenge Window**: Players may challenge the block
5. **Resolution**: Action succeeds or fails based on outcomes

### State Machine Phases

```
ACTION_DECLARATION
       ↓
AWAITING_CHALLENGE ←────────────┐
       ↓                        │
AWAITING_BLOCK                  │
       ↓                        │
AWAITING_BLOCK_CHALLENGE        │
       ↓                        │
RESOLVING_CHALLENGE ────────────┤
       ↓                        │
SELECTING_INFLUENCE_TO_LOSE     │
       ↓                        │
EXCHANGING_CARDS (Ambassador)   │
       ↓                        │
RESOLVING_ACTION ───────────────┘
       ↓
   GAME_OVER (when 1 player remains)
```

---

## 🛠️ Technical Details

### Tech Stack

**Backend:**
- Node.js
- Express.js
- Socket.io (WebSocket communication)

**Frontend:**
- React 18
- Vite (build tool)
- Tailwind CSS (styling)
- Framer Motion (animations)
- Zustand (state management)
- Lucide React (icons)
- React Router DOM (routing)

### WebSocket Events

**Lobby Events:**
- `createLobby` / `joinLobby` / `leaveLobby`
- `toggleReady` / `startGame`
- `lobbyUpdated` / `playerDisconnected`

**Game Events:**
- `gameAction` - Perform an action
- `challenge` - Challenge an action/block
- `block` - Block an action
- `allowAction` - Allow action to proceed
- `selectInfluenceToLose` - Choose card to reveal
- `exchangeCards` - Complete Ambassador exchange
- `gameStarted` / `gameStateUpdated`

---

## 🎨 Customizing Character Art

The game includes placeholder SVG cards. To use custom artwork:

1. Generate or create your character images (recommended size: 200x280px)
2. Replace the files in `client/public/cards/`:
   - `duke.svg`
   - `assassin.svg`
   - `captain.svg`
   - `ambassador.svg`
   - `contessa.svg`
   - `card-back.svg`

### Image Generation Prompts

For realistic character portraits, use these prompts with AI image generators:

**Duke:**
> A realistic oil-painting style portrait of a corrupt, wealthy politician. He is an older man with graying hair, wearing a high-collared velvet coat and a heavy gold ring. He is holding a gold coin up to the light. His expression is arrogant and greedy. Upper body shot, neutral background.

**Assassin:**
> A realistic portrait of a female assassin in stealth gear. She wears a dark hood partially obscuring her face, but her intense eyes are visible. She holds a small blade. Practical leather and cloth gear. Cold, focused expression. Dark, moody lighting, upper body shot.

**Captain:**
> A realistic portrait of a military general. A tough middle-aged man with a scar on his cheek, wearing a standard military dress uniform with medals. Authoritative and stern expression. Warm lighting, upper body shot.

**Ambassador:**
> A realistic portrait of a diplomat or merchant. A well-dressed man in fine silk clothing, holding a sealed scroll. He has a charming but deceptive smile. Soft lighting, embassy background, upper body shot.

**Contessa:**
> A realistic portrait of a powerful noblewoman. She wears an elegant red dress and expensive jewelry. She holds a traditional folding fan near her face, looking over it with a sharp, calculating gaze. Calm but dangerous expression. Luxurious background, upper body shot.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

## 📄 License

This project is a fan-made digital adaptation of the card game COUP. 
COUP is designed by Rikki Tahta and published by Indie Boards & Cards.

---

<p align="center">
  Made with ❤️ for fans of social deduction games
</p>
