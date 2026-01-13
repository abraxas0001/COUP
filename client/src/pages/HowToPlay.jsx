import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Target, 
  Shield, 
  Swords,
  Eye,
  EyeOff,
  Coins,
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  Play,
  HelpCircle,
  Crown
} from 'lucide-react'
import { CHARACTERS, ACTIONS } from '../constants/gameConstants'
import Logo from '../components/Logo'
import CharacterCard from '../components/CharacterCard'

const sections = [
  { id: 'objective', title: 'Objective & Setup', icon: Target },
  { id: 'bluffing', title: 'The Core Mechanic: Bluffing', icon: Eye },
  { id: 'characters', title: 'Characters & Actions', icon: Crown },
  { id: 'general', title: 'General Actions', icon: Coins },
  { id: 'challenge', title: 'The Challenge Flow', icon: Swords },
  { id: 'blocking', title: 'Blocking & Counteractions', icon: Shield },
  { id: 'tips', title: 'Strategy Tips', icon: HelpCircle },
]

export default function HowToPlay() {
  const [activeSection, setActiveSection] = useState('objective')
  const [expandedCharacter, setExpandedCharacter] = useState(null)
  const [challengeStep, setChallengeStep] = useState(0)

  return (
    <div className="min-h-screen bg-coup-dark relative z-10">
      {/* Header */}
      <header className="border-b border-coup-gray-light bg-coup-darker/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-coup-gold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <Logo size="small" />
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar Navigation */}
        <aside className="w-64 hidden lg:block sticky top-24 h-fit">
          <nav className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                  activeSection === section.id
                    ? 'bg-coup-gold/10 text-coup-gold border border-coup-gold/30'
                    : 'text-gray-400 hover:text-white hover:bg-coup-gray'
                }`}
              >
                <section.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl text-coup-gold mb-4">How to Play Coup</h1>
            <p className="text-gray-400 text-lg">
              Master the art of deception and become the last player standing.
            </p>
          </motion.div>

          {/* Mobile Section Selector */}
          <div className="lg:hidden mb-6">
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="w-full input-primary"
            >
              {sections.map(section => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>

          {/* Sections */}
          <AnimatePresence mode="wait">
            {/* Objective & Setup */}
            {activeSection === 'objective' && (
              <motion.section
                key="objective"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-coup-gold" />
                    <h2 className="font-display text-2xl text-coup-gold">The Goal</h2>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-6">
                    <span className="text-coup-gold font-semibold">Be the last player with Influence.</span>{' '}
                    Eliminate all other players by forcing them to lose their influence cards.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-coup-gray rounded-xl p-6">
                      <h3 className="font-display text-coup-gold mb-4 flex items-center gap-2">
                        <Coins className="w-5 h-5" />
                        Starting Resources
                      </h3>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-coup-gold rounded-full" />
                          <span><strong>2 Coins</strong> from the Treasury</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-coup-gold rounded-full" />
                          <span><strong>2 Influence Cards</strong> dealt face-down</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-coup-gray rounded-xl p-6">
                      <h3 className="font-display text-coup-gold mb-4 flex items-center gap-2">
                        <EyeOff className="w-5 h-5" />
                        Influence is Life
                      </h3>
                      <p className="text-gray-300">
                        Your face-down cards are your <strong className="text-coup-gold">Influence</strong>. 
                        When you lose influence, you must reveal (flip face-up) one card. 
                        When both cards are revealed, you're <strong className="text-red-400">eliminated</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* The Deck */}
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <h3 className="font-display text-xl text-coup-gold mb-6">The Court Deck</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {Object.values(CHARACTERS).map((char) => (
                      <div 
                        key={char.id}
                        className={`px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r ${char.gradient} text-white`}
                      >
                        {char.name} × 3
                      </div>
                    ))}
                  </div>
                  <p className="text-center text-gray-500 mt-4">
                    15 cards total • 3 copies of each character
                  </p>
                </div>
              </motion.section>
            )}

            {/* Bluffing */}
            {activeSection === 'bluffing' && (
              <motion.section
                key="bluffing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-8 h-8 text-coup-gold" />
                    <h2 className="font-display text-2xl text-coup-gold">The Golden Rule</h2>
                  </div>

                  <div className="bg-gradient-to-r from-coup-gold/20 to-transparent border-l-4 border-coup-gold p-6 rounded-r-xl mb-6">
                    <p className="text-xl text-white font-medium">
                      You can perform <span className="text-coup-gold">ANY character action</span>, 
                      even if you don't have that character card!
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-bold">✓</span>
                      </div>
                      <div>
                        <h4 className="text-green-400 font-semibold mb-1">If No One Challenges</h4>
                        <p className="text-gray-400">Your action succeeds automatically. You never have to prove you have the card!</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-red-400 font-bold">✗</span>
                      </div>
                      <div>
                        <h4 className="text-red-400 font-semibold mb-1">If Someone Challenges and You're Bluffing</h4>
                        <p className="text-gray-400">You lose an influence! Your lie has been exposed.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">!</span>
                      </div>
                      <div>
                        <h4 className="text-blue-400 font-semibold mb-1">If Someone Challenges and You Have the Card</h4>
                        <p className="text-gray-400">The challenger loses an influence! You show your card, shuffle it back into the deck, and draw a new one.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visual Example */}
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <h3 className="font-display text-xl text-coup-gold mb-6">Example Scenario</h3>
                  
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="w-16 h-24 bg-coup-gray rounded-lg border-2 border-coup-gold/30 flex items-center justify-center mb-2">
                        <span className="text-2xl">?</span>
                      </div>
                      <p className="text-sm text-gray-400">Your Cards</p>
                      <p className="text-xs text-coup-gold">(Hidden)</p>
                    </div>
                  </div>

                  <div className="bg-coup-gray rounded-xl p-6 text-center">
                    <p className="text-gray-300 mb-4">
                      You don't have a Duke, but you claim "I'll take Tax as the Duke" anyway...
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2">
                        <span className="text-green-400">Nobody challenges → You get 3 coins!</span>
                      </div>
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2">
                        <span className="text-red-400">Someone challenges → You lose influence!</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Characters */}
            {activeSection === 'characters' && (
              <motion.section
                key="characters"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Crown className="w-8 h-8 text-coup-gold" />
                    <h2 className="font-display text-2xl text-coup-gold">The Five Characters</h2>
                  </div>
                  <p className="text-gray-400 mb-8">
                    Click on a character to learn about their abilities. Each character has a unique action, 
                    and some can block other players' actions.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.values(CHARACTERS).map((character) => (
                      <motion.div
                        key={character.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setExpandedCharacter(
                          expandedCharacter === character.id ? null : character.id
                        )}
                        className="cursor-pointer"
                      >
                        <CharacterCard
                          character={character}
                          isExpanded={expandedCharacter === character.id}
                          showDetails={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Character Actions Quick Reference */}
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <h3 className="font-display text-xl text-coup-gold mb-6">Quick Reference Table</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-coup-gray-light">
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Character</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Effect</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-medium">Can Block</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.values(CHARACTERS).map((char) => (
                          <tr key={char.id} className="border-b border-coup-gray-light/50">
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${char.gradient}`}>
                                {char.name}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white">{char.actionName || '—'}</td>
                            <td className="py-3 px-4 text-gray-300">{char.actionDescription || '—'}</td>
                            <td className="py-3 px-4 text-gray-300">{char.counteraction || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.section>
            )}

            {/* General Actions */}
            {activeSection === 'general' && (
              <motion.section
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Coins className="w-8 h-8 text-coup-gold" />
                    <h2 className="font-display text-2xl text-coup-gold">General Actions</h2>
                  </div>
                  <p className="text-gray-400 mb-8">
                    These actions don't require any character card. Anyone can perform them.
                  </p>

                  <div className="space-y-4">
                    {/* Income */}
                    <div className="bg-coup-gray rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-white">Income</h3>
                        <span className="text-green-400 text-sm bg-green-500/20 px-3 py-1 rounded-full">
                          Safe - Cannot be blocked or challenged
                        </span>
                      </div>
                      <p className="text-gray-300">Take <strong className="text-coup-gold">1 coin</strong> from the Treasury.</p>
                    </div>

                    {/* Foreign Aid */}
                    <div className="bg-coup-gray rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-white">Foreign Aid</h3>
                        <span className="text-yellow-400 text-sm bg-yellow-500/20 px-3 py-1 rounded-full">
                          Can be blocked by Duke
                        </span>
                      </div>
                      <p className="text-gray-300">Take <strong className="text-coup-gold">2 coins</strong> from the Treasury.</p>
                    </div>

                    {/* Coup */}
                    <div className="bg-coup-gray rounded-xl p-6 border-2 border-red-500/30">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-display text-lg text-white">Coup</h3>
                        <span className="text-red-400 text-sm bg-red-500/20 px-3 py-1 rounded-full">
                          Unstoppable - Cannot be blocked or challenged
                        </span>
                      </div>
                      <p className="text-gray-300 mb-4">
                        Pay <strong className="text-red-400">7 coins</strong> to force any player to immediately lose an influence.
                      </p>
                      
                      <div className="flex items-center gap-3 bg-red-500/10 rounded-lg p-4">
                        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 font-medium">
                          <strong>Crucial Rule:</strong> If you start your turn with 10+ coins, you MUST Coup!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Challenge Flow */}
            {activeSection === 'challenge' && (
              <motion.section
                key="challenge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Swords className="w-8 h-8 text-coup-gold" />
                    <h2 className="font-display text-2xl text-coup-gold">The Challenge Flow</h2>
                  </div>
                  <p className="text-gray-400 mb-8">
                    Walk through this interactive example to understand how challenges work.
                  </p>

                  {/* Interactive Challenge Steps */}
                  <div className="space-y-4">
                    {[
                      {
                        title: "Step 1: Player Claims an Action",
                        content: "Player A claims Duke to take Tax (3 coins).",
                        icon: "🎭"
                      },
                      {
                        title: "Step 2: Challenge Window Opens",
                        content: "Any other player can now challenge by clicking the CHALLENGE button. They have limited time to decide.",
                        icon: "⏱️"
                      },
                      {
                        title: "Step 3a: Challenge Succeeds (Player A was bluffing)",
                        content: "Player A cannot show a Duke card. Player A loses 1 influence and the action fails.",
                        icon: "❌"
                      },
                      {
                        title: "Step 3b: Challenge Fails (Player A had the card)",
                        content: "Player A reveals their Duke, shuffles it back, and draws a new card. The challenger loses 1 influence. The original action succeeds!",
                        icon: "✅"
                      }
                    ].map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0.5 }}
                        animate={{ 
                          opacity: challengeStep >= index ? 1 : 0.5,
                          scale: challengeStep === index ? 1.02 : 1
                        }}
                        className={`bg-coup-gray rounded-xl p-6 cursor-pointer transition-all ${
                          challengeStep === index ? 'ring-2 ring-coup-gold' : ''
                        }`}
                        onClick={() => setChallengeStep(index)}
                      >
                        <div className="flex items-start gap-4">
                          <span className="text-3xl">{step.icon}</span>
                          <div>
                            <h4 className="font-display text-coup-gold mb-2">{step.title}</h4>
                            <p className="text-gray-300">{step.content}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => setChallengeStep(Math.max(0, challengeStep - 1))}
                      disabled={challengeStep === 0}
                      className="btn-secondary disabled:opacity-30"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setChallengeStep(Math.min(3, challengeStep + 1))}
                      disabled={challengeStep === 3}
                      className="btn-primary"
                    >
                      Next Step
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Blocking */}
            {activeSection === 'blocking' && (
              <motion.section
                key="blocking"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-8 h-8 text-coup-gold" />
                    <h2 className="font-display text-2xl text-coup-gold">Blocking & Counteractions</h2>
                  </div>
                  
                  <p className="text-gray-400 mb-8">
                    Some actions can be blocked by claiming to have a specific character. 
                    Blocks can also be challenged!
                  </p>

                  <div className="space-y-4">
                    <div className="bg-coup-gray rounded-xl p-6">
                      <h4 className="font-display text-duke mb-2">Duke Blocks Foreign Aid</h4>
                      <p className="text-gray-300">
                        If someone takes Foreign Aid, any player can claim Duke to block it. 
                        The player receives no coins.
                      </p>
                    </div>

                    <div className="bg-coup-gray rounded-xl p-6">
                      <h4 className="font-display text-contessa mb-2">Contessa Blocks Assassination</h4>
                      <p className="text-gray-300">
                        If you're being assassinated, you can claim Contessa to block. 
                        <span className="text-yellow-400"> Note: The 3 coins are still spent!</span>
                      </p>
                    </div>

                    <div className="bg-coup-gray rounded-xl p-6">
                      <h4 className="font-display text-captain mb-2">Captain/Ambassador Block Stealing</h4>
                      <p className="text-gray-300">
                        If someone tries to steal from you, claim either Captain or Ambassador to block.
                      </p>
                    </div>
                  </div>

                  {/* Double Danger */}
                  <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <h4 className="font-display text-red-400 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Double Danger: Assassination Gone Wrong
                    </h4>
                    <p className="text-gray-300 mb-4">
                      It's possible to lose <strong className="text-red-400">2 influence</strong> in one turn:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-gray-300">
                      <li>Player A assassinates you</li>
                      <li>You claim Contessa to block (but you're bluffing)</li>
                      <li>Player A challenges your block</li>
                      <li>You lose 1 influence for the failed challenge</li>
                      <li>The assassination goes through → You lose another influence!</li>
                    </ol>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Tips */}
            {activeSection === 'tips' && (
              <motion.section
                key="tips"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="glass border border-coup-gold/20 rounded-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <HelpCircle className="w-8 h-8 text-coup-gold" />
                    <h2 className="font-display text-2xl text-coup-gold">Strategy Tips</h2>
                  </div>

                  <div className="grid gap-4">
                    {[
                      {
                        tip: "Duke is King Early Game",
                        desc: "Claiming Duke for Tax (3 coins) is low-risk early since everyone wants coins. Challenge sparingly.",
                        color: "purple"
                      },
                      {
                        tip: "Count the Cards",
                        desc: "Track revealed cards! If 2 Dukes are face-up and someone claims Duke, consider challenging.",
                        color: "blue"
                      },
                      {
                        tip: "Save Coins for Coup",
                        desc: "Having 7+ coins gives you an unstoppable kill option. Don't overspend on Assassinations.",
                        color: "red"
                      },
                      {
                        tip: "Bluff Contessa When Targeted",
                        desc: "Being assassinated? Even without Contessa, claiming it might save you if they don't challenge.",
                        color: "pink"
                      },
                      {
                        tip: "Target the Leader",
                        desc: "The player with the most coins is dangerous. Steal from them or Coup them first.",
                        color: "green"
                      },
                      {
                        tip: "Vary Your Claims",
                        desc: "Don't always claim the same character. Mix it up to keep opponents guessing.",
                        color: "yellow"
                      }
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-coup-gray rounded-xl p-6 border-l-4 border-${item.color}-500`}
                      >
                        <h4 className="font-display text-white mb-2">{item.tip}</h4>
                        <p className="text-gray-400">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Ready to Play */}
                <div className="glass border border-coup-gold/20 rounded-2xl p-8 text-center">
                  <h3 className="font-display text-2xl text-coup-gold mb-4">Ready to Play?</h3>
                  <p className="text-gray-400 mb-6">
                    You now know everything you need. Time to put your skills to the test!
                  </p>
                  <Link to="/" className="btn-primary inline-flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Playing
                  </Link>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
