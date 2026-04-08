import React, { useEffect, useRef, useState } from 'react'
import { ParticleTextEffect } from '@/components/ui/particle-text-effect'

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const TOTAL_FRAMES = 300  /* updated below after glob resolves */
const NAV_H        = 68

/* 
  Import all PNGs from the frame folder via Vite's glob import.
  This is the only reliable way — dynamic new URL() template literals
  are NOT statically analysable by Vite and produce broken paths.
  glob returns an object keyed by path; we sort and extract the URLs.
*/
const frameGlob = import.meta.glob(
  '../../assets/frame/ezgif-frame-*.png',
  { eager: true, import: 'default' }
)

/* Sort keys alphabetically (001, 002 … 300) then build the URL array */
const FRAME_URLS = Object.keys(frameGlob)
  .sort()
  .map(k => frameGlob[k])

/* ─────────────────────────────────────────────────────────
   HOOK — scroll progress 0→1 inside a tall container
───────────────────────────────────────────────────────── */
function useScrollProgress(ref) {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const scrollable = el.getBoundingClientRect().height - window.innerHeight
      const scrolled   = -el.getBoundingClientRect().top
      setP(Math.min(1, Math.max(0, scrolled / scrollable)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [ref])
  return p
}

/* ─────────────────────────────────────────────────────────
   IMAGE SEQUENCE CANVAS
   — preloads all frames, draws the current one each RAF
   — sits absolute behind everything (z-index 0)
───────────────────────────────────────────────────────── */
function FrameCanvas({ frameIndex }) {
  const canvasRef = useRef(null)
  const images    = useRef([])          // HTMLImageElement[]
  const loaded    = useRef(0)
  const pending   = useRef(frameIndex)  // frame to draw once ready

  /* Preload all frames once on mount */
  useEffect(() => {
    images.current = FRAME_URLS.map((src, i) => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        loaded.current++
        const canvas = canvasRef.current
        if (canvas && canvas.width === 0) {
          canvas.width  = canvas.offsetWidth  || window.innerWidth
          canvas.height = canvas.offsetHeight || window.innerHeight
        }
        if (i === pending.current) drawFrame(i)
        if (i === 0) drawFrame(0)
      }
      return img
    })
  }, [])

  /* Draw whenever frameIndex changes */
  useEffect(() => {
    pending.current = frameIndex
    drawFrame(frameIndex)
  }, [frameIndex])

  function drawFrame(idx) {
    const canvas = canvasRef.current
    if (!canvas) return
    const img = images.current[idx]
    if (!img || !img.complete || img.naturalWidth === 0) return

    const ctx = canvas.getContext('2d')
    const cw  = canvas.width
    const ch  = canvas.height
    const iw  = img.naturalWidth
    const ih  = img.naturalHeight

    /* Cover-fit: fill the canvas, centre the image */
    const scale = Math.max(cw / iw, ch / ih)
    const dw    = iw * scale
    const dh    = ih * scale
    const dx    = (cw - dw) / 2
    const dy    = (ch - dh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
  }

  /* Resize canvas to match its CSS size */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sync = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth
      canvas.height = canvas.offsetHeight || window.innerHeight
      drawFrame(pending.current)
    }
    sync()
    const ro = new ResizeObserver(sync)
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position:  'absolute',
        inset:     0,
        width:     '100%',
        height:    '100%',
        zIndex:    0,           /* behind everything */
        display:   'block',
        willChange: 'contents',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────
   STAR-FIELD CANVAS  (subtle, always-on background layer)
───────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx    = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 140 }, () => ({
      x:  Math.random(),
      y:  Math.random(),
      r:  Math.random() * 0.9 + 0.2,
      o:  Math.random() * 0.5 + 0.1,
      sp: Math.random() * 0.003 + 0.001,
      t:  Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.t += s.sp
        const alpha = s.o * (0.6 + 0.4 * Math.sin(s.t))
        ctx.beginPath()
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(165,216,255,${alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position:       'absolute',
        inset:          0,
        width:          '100%',
        height:         '100%',
        zIndex:         1,   /* above solid bg, below frame canvas */
        pointerEvents:  'none',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────
   SCROLL CUE
───────────────────────────────────────────────────────── */
function ScrollCue({ visible }) {
  return (
    <div
      style={{
        position:       'absolute',
        bottom:         32,
        left:           '50%',
        transform:      'translateX(-50%)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            8,
        zIndex:         10,
        pointerEvents:  'none',
        opacity:        visible ? 1 : 0,
        transition:     'opacity 0.5s ease',
      }}
    >
      <span style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(165,216,255,0.4)' }}>
        Scroll to Explore
      </span>
      <div style={{
        width: 1.5, height: 36,
        background: 'linear-gradient(to bottom, transparent, #00D6FF)',
        animation: 'scrollCueBob 2s ease-in-out infinite',
        borderRadius: 9999,
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   COPY LAYER — text + badge + CTAs, always z-index 10
   Fades / transforms per scroll phase
───────────────────────────────────────────────────────── */
function CopyLayer({ progress }) {
  /* Phase helpers */
  const fade = (start, end) =>
    Math.min(1, Math.max(0, (progress - start) / (end - start)))
  const fadeOut = (start, end) => 1 - fade(start, end)

  /* Phase 0 (0–15%): hero copy */
  const heroO   = fadeOut(0.12, 0.20)
  /* Phase 1 (15–40%): quality copy */
  const qualO   = Math.min(fade(0.15, 0.22), fadeOut(0.38, 0.45))
  /* Phase 2 (40–65%): anatomy copy */
  const anatO   = Math.min(fade(0.40, 0.48), fadeOut(0.63, 0.70))
  /* Phase 3 (65–85%): system copy */
  const sysO    = Math.min(fade(0.65, 0.72), fadeOut(0.83, 0.90))
  /* Phase 4 (85–100%): CTA */
  const ctaO    = fade(0.85, 0.93)
  const ctaScale = 0.9 + ctaO * 0.1

  const headingStyle = {
    fontFamily:     'Inter, -apple-system, sans-serif',
    fontWeight:     900,
    letterSpacing:  '-0.03em',
    lineHeight:     0.95,
    fontSize:       'clamp(3.2rem, 9vw, 7rem)',
    background:     'linear-gradient(160deg, rgba(255,255,255,0.95) 0%, #A5D8FF 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor:  'transparent',
    backgroundClip: 'text',
    margin:         0,
    textAlign:      'center',
  }

  const subStyle = {
    fontSize:    'clamp(0.9rem, 2vw, 1.15rem)',
    fontWeight:  300,
    color:       'rgba(255,255,255,0.55)',
    letterSpacing: '0.04em',
    marginTop:   16,
    textAlign:   'center',
    maxWidth:    480,
  }

  const badgeStyle = {
    display:        'inline-flex',
    alignItems:     'center',
    gap:            7,
    padding:        '5px 14px',
    borderRadius:   9999,
    background:     'rgba(0,214,255,0.08)',
    border:         '1px solid rgba(0,214,255,0.25)',
    fontSize:       11,
    fontWeight:     600,
    letterSpacing:  '0.16em',
    textTransform:  'uppercase',
    color:          'rgba(0,214,255,0.9)',
    marginBottom:   20,
  }

  const sectionLabelStyle = {
    fontSize:       10,
    fontWeight:     600,
    letterSpacing:  '0.22em',
    textTransform:  'uppercase',
    color:          'rgba(0,214,255,0.7)',
    marginBottom:   12,
  }

  const bodyStyle = {
    fontSize:    'clamp(0.85rem, 1.8vw, 1rem)',
    fontWeight:  400,
    color:       'rgba(255,255,255,0.5)',
    lineHeight:  1.75,
    maxWidth:    400,
    textAlign:   'center',
  }

  return (
    <div style={{
      position:       'absolute',
      inset:          0,
      zIndex:         10,
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      paddingTop:     NAV_H,
      pointerEvents:  'none',
      userSelect:     'none',
    }}>

      {/* ── PHASE 0 — Hero ── */}
      <div style={{ opacity: heroO, transition: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute' }}>
        <div style={badgeStyle}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00D6FF', boxShadow: '0 0 8px #00D6FF', animation: 'pulse 2s ease-in-out infinite' }} />
          The Danaco Experience
        </div>
        <h1 style={headingStyle}>WELCOME</h1>
        <p style={subStyle}>Freshness, Locked in.</p>
      </div>

      {/* ── PHASE 1 — Quality Reveal ── */}
      <div style={{ opacity: qualO, transition: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', transform: `translateY(${(1 - qualO) * 24}px)` }}>
        <p style={sectionLabelStyle}>Quality Reveal</p>
        <h2 style={{ ...headingStyle, fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>Precision-Engineered<br />Freshness.</h2>
        <p style={{ ...bodyStyle, marginTop: 20 }}>Vacuum-sealed technology and temperature-controlled logistics — locked at peak quality from facility to doorstep.</p>
      </div>

      {/* ── PHASE 2 — Anatomy ── */}
      <div style={{ opacity: anatO, transition: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', transform: `translateY(${(1 - anatO) * 24}px)` }}>
        <p style={sectionLabelStyle}>Product Anatomy</p>
        <h2 style={{ ...headingStyle, fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>Quality<br />You Can See.</h2>
        <p style={{ ...bodyStyle, marginTop: 20 }}>Halal Certified · Triple-Layer Protection · −18 °C Storage</p>
        {/* Stat row */}
        <div style={{ display: 'flex', gap: 32, marginTop: 28 }}>
          {[['−18°C','Storage Temp'],['3×','Layer Protection'],['48h','Freshness Lock']].map(([val, lbl], i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: i === 0 ? '#00D6FF' : 'rgba(255,255,255,0.9)', textShadow: i === 0 ? '0 0 20px rgba(0,214,255,0.6)' : 'none' }}>{val}</span>
              <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PHASE 3 — System Intelligence ── */}
      <div style={{ opacity: sysO, transition: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute', transform: `translateY(${(1 - sysO) * 24}px)` }}>
        <p style={sectionLabelStyle}>System Intelligence</p>
        <h2 style={{ ...headingStyle, fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>Real-time Inventory.<br />Absolute Control.</h2>
        <p style={{ ...bodyStyle, marginTop: 20 }}>Powered by role-based dashboards for Inventory Managers, Order Managers, and Finance — every layer of the supply chain, unified.</p>
      </div>

      {/* ── PHASE 4 — CTA ── */}
      <div style={{
        opacity:        ctaO,
        transform:      `scale(${ctaScale})`,
        transition:     'none',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        position:       'absolute',
        pointerEvents:  ctaO > 0.5 ? 'auto' : 'none',
        gap:            24,
      }}>
        <h2 style={{ ...headingStyle, fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}>
          The Future of<br />Frozen Food Management.
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <a href="/shop" style={{
            padding:        '13px 36px',
            borderRadius:   9999,
            background:     'linear-gradient(135deg, #00D6FF 0%, #A5D8FF 100%)',
            color:          '#050505',
            fontWeight:     800,
            fontSize:       14,
            letterSpacing:  '0.04em',
            textDecoration: 'none',
            boxShadow:      '0 0 32px rgba(0,214,255,0.4)',
            transition:     'box-shadow 0.3s, transform 0.2s',
            pointerEvents:  'auto',
          }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 52px rgba(0,214,255,0.65)'; e.currentTarget.style.transform = 'scale(1.04)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 32px rgba(0,214,255,0.4)';  e.currentTarget.style.transform = 'scale(1)' }}
          >
            Get Started
          </a>
          <a href="/orders" style={{
            padding:        '12px 32px',
            borderRadius:   9999,
            background:     'transparent',
            border:         '1px solid rgba(255,255,255,0.18)',
            color:          'rgba(255,255,255,0.7)',
            fontWeight:     500,
            fontSize:       14,
            letterSpacing:  '0.02em',
            textDecoration: 'none',
            transition:     'border-color 0.3s, color 0.3s',
            pointerEvents:  'auto',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          >
            View System Logs
          </a>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {['−18°C Guaranteed', 'Halal Certified', '48h Freshness'].map((t, i) => (
            <span key={i} style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em' }}>{t}</span>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────────────────── */
function ProgressBar({ progress }) {
  return (
    <div style={{
      position:   'fixed',
      top:        NAV_H,
      left:       0,
      right:      0,
      height:     1,
      background: 'rgba(255,255,255,0.05)',
      zIndex:     490,
    }}>
      <div style={{
        height:     '100%',
        width:      `${progress * 100}%`,
        background: 'linear-gradient(90deg, transparent, #00D6FF)',
        boxShadow:  '0 0 6px rgba(0,214,255,0.6)',
        transition: 'width 0.04s linear',
      }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   HOME
───────────────────────────────────────────────────────── */
export default function Home() {
  const containerRef = useRef(null)
  const progress     = useScrollProgress(containerRef)

  /* Map progress 0→1 to frame index 0→(last frame) */
  const frameIndex = Math.min(FRAME_URLS.length - 1, Math.floor(progress * FRAME_URLS.length))

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scrollCueBob{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <ProgressBar progress={progress} />

      {/* Tall scroll container — 600vh gives smooth scrubbing across 300 frames */}
      <div ref={containerRef} style={{ height: '600vh', position: 'relative' }}>

        {/* Sticky viewport */}
        <div style={{
          position:   'sticky',
          top:        0,
          height:     '100vh',
          overflow:   'hidden',
          background: '#020818',   /* deep midnight navy — matches frame bg */
        }}>

          {/* Layer 0 — star field (always visible, subtle) */}
          <StarField />

          {/* Layer 1 — image sequence canvas (z-index 2, behind text) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            <FrameCanvas frameIndex={frameIndex} />
          </div>

          {/* Layer 1.5 — transparent navy overlay above frames */}
          <div style={{
            position:      'absolute',
            inset:         0,
            zIndex:        3,
            pointerEvents: 'none',
            background:    'rgba(2, 8, 24, 0.45)',
          }} />

          {/* Layer 2 — vignette so edges blend into navy */}
          <div style={{
            position:       'absolute',
            inset:          0,
            zIndex:         4,
            pointerEvents:  'none',
            background:     'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,8,24,0.75) 100%)',
          }} />

          {/* Layer 3 — copy (z-index 10) */}
          <CopyLayer progress={progress} />

          {/* Layer 4 — scroll cue */}
          <ScrollCue visible={progress < 0.06} />

          {/* Layer 5 — end-of-sequence fade to navy */}
          <div style={{
            position:      'absolute',
            inset:         0,
            zIndex:        20,
            pointerEvents: 'none',
            background:    '#020818',
            opacity:       Math.max(0, (progress - 0.88) / 0.12),
          }} />

        </div>
      </div>

      {/* ── Particle text section — fades in as frames fade out ── */}
      <div style={{
        opacity:   Math.min(1, Math.max(0, (progress - 0.90) / 0.10)),
        transform: `translateY(${(1 - Math.min(1, Math.max(0, (progress - 0.90) / 0.10))) * 24}px)`,
      }}>
        <ParticleTextEffect />
      </div>
    </>
  )
}
