// Simple confetti effect
export default function confetti() {
  const colors = ['#D4AF37', '#F4D03F', '#9B59B6', '#3498DB', '#E74C3C', '#27AE60']
  const confettiCount = 150
  
  for (let i = 0; i < confettiCount; i++) {
    createConfettiPiece(colors[Math.floor(Math.random() * colors.length)], i)
  }
}

function createConfettiPiece(color, index) {
  const confetti = document.createElement('div')
  
  // Random properties
  const size = Math.random() * 10 + 5
  const left = Math.random() * 100
  const delay = Math.random() * 3
  const duration = Math.random() * 3 + 2
  
  confetti.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size}px;
    background-color: ${color};
    left: ${left}%;
    top: -20px;
    opacity: 0.8;
    z-index: 9999;
    pointer-events: none;
    animation: confetti-fall ${duration}s ease-out ${delay}s forwards;
    transform: rotate(${Math.random() * 360}deg);
    border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
  `
  
  document.body.appendChild(confetti)
  
  // Remove after animation
  setTimeout(() => {
    confetti.remove()
  }, (duration + delay) * 1000 + 100)
}

// Add the animation to the page
const style = document.createElement('style')
style.textContent = `
  @keyframes confetti-fall {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }
`
document.head.appendChild(style)
