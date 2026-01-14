import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rootDir = path.resolve(__dirname, '..', '..')
const clientPublicMusic = path.resolve(__dirname, '..', 'public', 'music')

const tracks = [
  'Yiruma - River Flows In You.mp3',
  '96 (Original Background Score) CD 1 TRACK 1 (320).mp3'
]

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

function copyIfExists(src, dest) {
  try {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
      console.log(`Copied: ${path.basename(src)} -> ${dest}`)
    } else {
      console.warn(`Missing source: ${src}`)
    }
  } catch (err) {
    console.error(`Failed copying ${src} -> ${dest}:`, err.message)
  }
}

ensureDir(clientPublicMusic)

tracks.forEach(filename => {
  const src = path.resolve(rootDir, filename)
  const dest = path.resolve(clientPublicMusic, filename)
  copyIfExists(src, dest)
})

console.log('Music copy script finished.')
