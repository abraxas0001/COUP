import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Source: /music folder at project root
const musicSourceDir = path.resolve(__dirname, '..', '..', 'music')
// Destination: /client/public/music
const clientPublicMusic = path.resolve(__dirname, '..', 'public', 'music')

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function copyIfExists(src, dest) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
      console.log(`Copied: ${path.basename(src)}`)
    } else {
      console.warn(`Missing source: ${src}`)
    }
  } catch (err) {
    console.error(`Failed copying ${src} -> ${dest}:`, err.message)
  }
}

// Ensure destination directory exists
ensureDir(clientPublicMusic)

// Dynamically scan music folder for all audio files
const audioExtensions = ['.mp3', '.ogg', '.wav', '.m4a', '.flac']

if (fs.existsSync(musicSourceDir)) {
  const files = fs.readdirSync(musicSourceDir)
  const audioFiles = files.filter(f => audioExtensions.includes(path.extname(f).toLowerCase()))
  
  if (audioFiles.length === 0) {
    console.log('No audio files found in /music folder')
  } else {
    audioFiles.forEach(filename => {
      const src = path.join(musicSourceDir, filename)
      const dest = path.join(clientPublicMusic, filename)
      copyIfExists(src, dest)
    })
    console.log(`\nCopied ${audioFiles.length} audio file(s) to client/public/music`)
  }
} else {
  console.warn('Music source folder not found:', musicSourceDir)
}

console.log('Music copy script finished.')
