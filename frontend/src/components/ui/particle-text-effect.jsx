import { useEffect, useRef } from "react"

class Particle {
  pos = { x: 0, y: 0 }
  vel = { x: 0, y: 0 }
  acc = { x: 0, y: 0 }
  target = { x: 0, y: 0 }

  closeEnoughTarget = 100
  maxSpeed = 1.0
  maxForce = 0.1
  particleSize = 10
  isKilled = false

  startColor = { r: 0, g: 0, b: 0 }
  targetColor = { r: 0, g: 0, b: 0 }
  colorWeight = 0
  colorBlendRate = 0.01

  move() {
    let proximityMult = 1
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    )
    if (distance < this.closeEnoughTarget) proximityMult = distance / this.closeEnoughTarget

    const towardsTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y }
    const mag = Math.sqrt(towardsTarget.x ** 2 + towardsTarget.y ** 2)
    if (mag > 0) {
      towardsTarget.x = (towardsTarget.x / mag) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / mag) * this.maxSpeed * proximityMult
    }

    const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y }
    const sMag = Math.sqrt(steer.x ** 2 + steer.y ** 2)
    if (sMag > 0) {
      steer.x = (steer.x / sMag) * this.maxForce
      steer.y = (steer.y / sMag) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y
    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx, drawAsPoints) {
    if (this.colorWeight < 1.0) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    const c = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }
    ctx.fillStyle = `rgb(${c.r},${c.g},${c.b})`
    if (drawAsPoints) {
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
    } else {
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      const rp = randomPos(width / 2, height / 2, (width + height) / 2)
      this.target.x = rp.x
      this.target.y = rp.y
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

function randomPos(x, y, mag) {
  const dir = { x: Math.random() * 1000 - x, y: Math.random() * 500 - y }
  const m = Math.sqrt(dir.x ** 2 + dir.y ** 2)
  if (m > 0) { dir.x = (dir.x / m) * mag; dir.y = (dir.y / m) * mag }
  return { x: x + dir.x, y: y + dir.y }
}

const DEFAULT_WORDS = [
  "DANACO",
  "FROZEN FRESH",
  "−18°C LOCKED",
  "HALAL CERTIFIED",
  "DELIVERED DAILY",
  "REAL-TIME STOCK",
  "ORDER SMARTER",
]

export function ParticleTextEffect({ words = DEFAULT_WORDS }) {
  const canvasRef    = useRef(null)
  const animRef      = useRef()
  const particlesRef = useRef([])
  const frameRef     = useRef(0)
  const wordIdxRef   = useRef(0)
  const mouseRef     = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false })

  const pixelSteps  = 6
  const drawAsPoints = true

  function nextWord(word, canvas) {
    const off = document.createElement("canvas")
    off.width  = canvas.width
    off.height = canvas.height
    const ctx  = off.getContext("2d")
    ctx.fillStyle    = "white"
    ctx.font         = "bold 80px Inter, Arial"
    ctx.textAlign    = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(word, canvas.width / 2, canvas.height / 2)

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    const newColor = { r: Math.random() * 80 + 0, g: Math.random() * 200 + 55, b: Math.random() * 55 + 200 }

    const particles = particlesRef.current
    let pIdx = 0

    const coords = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) coords.push(i)
    for (let i = coords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coords[i], coords[j]] = [coords[j], coords[i]]
    }

    for (const ci of coords) {
      if (pixels[ci + 3] > 0) {
        const x = (ci / 4) % canvas.width
        const y = Math.floor(ci / 4 / canvas.width)
        let p
        if (pIdx < particles.length) {
          p = particles[pIdx]; p.isKilled = false; pIdx++
        } else {
          p = new Particle()
          const rp = randomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2)
          p.pos.x = rp.x; p.pos.y = rp.y
          p.maxSpeed = Math.random() * 6 + 4
          p.maxForce = p.maxSpeed * 0.05
          p.particleSize = Math.random() * 6 + 6
          p.colorBlendRate = Math.random() * 0.0275 + 0.0025
          particles.push(p)
        }
        p.startColor = {
          r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
          g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
          b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
        }
        p.targetColor  = newColor
        p.colorWeight  = 0
        p.target.x = x; p.target.y = y
      }
    }
    for (let i = pIdx; i < particles.length; i++) particles[i].kill(canvas.width, canvas.height)
  }

  function animate() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    const particles = particlesRef.current

    ctx.fillStyle = "rgba(2,8,24,0.18)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.move(); p.draw(ctx, drawAsPoints)
      if (p.isKilled && (p.pos.x < 0 || p.pos.x > canvas.width || p.pos.y < 0 || p.pos.y > canvas.height)) {
        particles.splice(i, 1)
      }
    }

    if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
      particles.forEach(p => {
        const d = Math.sqrt((p.pos.x - mouseRef.current.x) ** 2 + (p.pos.y - mouseRef.current.y) ** 2)
        if (d < 50) p.kill(canvas.width, canvas.height)
      })
    }

    frameRef.current++
    if (frameRef.current % 240 === 0) {
      wordIdxRef.current = (wordIdxRef.current + 1) % words.length
      nextWord(words[wordIdxRef.current], canvas)
    }

    animRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const syncSize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    syncSize()
    window.addEventListener('resize', syncSize)

    canvas.width  = canvas.offsetWidth  || window.innerWidth
    canvas.height = canvas.offsetHeight || window.innerHeight
    nextWord(words[0], canvas)
    animate()

    const rect = () => canvas.getBoundingClientRect()
    const onDown  = e => { mouseRef.current.isPressed = true; mouseRef.current.isRightClick = e.button === 2; mouseRef.current.x = e.clientX - rect().left; mouseRef.current.y = e.clientY - rect().top }
    const onUp    = () => { mouseRef.current.isPressed = false; mouseRef.current.isRightClick = false }
    const onMove  = e => { mouseRef.current.x = e.clientX - rect().left; mouseRef.current.y = e.clientY - rect().top }
    const onCtx   = e => e.preventDefault()

    canvas.addEventListener("mousedown",    onDown)
    canvas.addEventListener("mouseup",      onUp)
    canvas.addEventListener("mousemove",    onMove)
    canvas.addEventListener("contextmenu",  onCtx)
    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', syncSize)
      canvas.removeEventListener("mousedown",   onDown)
      canvas.removeEventListener("mouseup",     onUp)
      canvas.removeEventListener("mousemove",   onMove)
      canvas.removeEventListener("contextmenu", onCtx)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center w-full" style={{ background: '#020818', overflow: 'hidden', minHeight: '100vh' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100vh', display: 'block' }} />
      <p className="mt-6 text-xs tracking-[0.22em] uppercase" style={{ color: 'rgba(0,214,255,0.35)' }}>
        Right-click &amp; drag to scatter · cycles every 4 s
      </p>
    </div>
  )
}
