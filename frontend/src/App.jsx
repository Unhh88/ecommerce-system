import React from 'react'
import Home from './pages/customer/Home'

const NAV_LINKS = [
  { label: 'Home',   href: '/' },
  { label: 'Shop',   href: '/shop' },
  { label: 'Orders', href: '/orders' },
]

function SnowflakeIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
      <line x1="16" y1="3"  x2="16" y2="29" stroke="#00F2FF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3"  y1="16" x2="29" y2="16" stroke="#00F2FF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6.5" y1="6.5"  x2="25.5" y2="25.5" stroke="#00F2FF" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25.5" y1="6.5" x2="6.5"  y2="25.5" stroke="#00F2FF" strokeWidth="1.5" strokeLinecap="round" />
      {/* branch ticks */}
      {[
        [16,8,  13,5,  19,5 ],
        [16,24, 13,27, 19,27],
        [8, 16, 5, 13, 5, 19],
        [24,16, 27,13, 27,19],
      ].map(([cx,cy,x1,y1,x2,y2], i) => (
        <g key={i}>
          <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="#00F2FF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
          <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#00F2FF" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
        </g>
      ))}
      <circle cx="16" cy="16" r="2.2" fill="#00F2FF" />
    </svg>
  )
}

function IconAccount() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  )
}

function IconCart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function renderPage(path) {
  const placeholder = (title, sub) => (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div
        className="w-full max-w-lg rounded-3xl p-10 text-center"
        style={{ background: '#112240', border: '1px solid #172A45' }}
      >
        <p className="text-2xl font-bold text-white">{title}</p>
        <p className="mt-3 text-sm" style={{ color: '#C1D1E0', opacity: 0.6 }}>{sub}</p>
      </div>
    </div>
  )

  switch (path) {
    case '/shop':    return placeholder('Shop', 'Product grid coming soon.')
    case '/orders':  return placeholder('Orders', 'Order history coming soon.')
    case '/cart':    return placeholder('Cart', 'Your cart is empty.')
    case '/account': return placeholder('Account', 'Profile settings coming soon.')
    default:         return <Home />
  }
}

export default function App() {
  const path = window.location.pathname

  return (
    <div className="min-h-screen bg-navy-base text-silver">

      {/* ── Glassmorphic Nav ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-[68px]"
        style={{
          background: 'rgba(2,12,27,0.80)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(23,42,69,0.8)',
        }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 shrink-0">
          <SnowflakeIcon />
          <span
            className="text-[13px] font-black tracking-[0.26em] uppercase"
            style={{ color: '#C1D1E0' }}
          >
            DANACO
          </span>
        </a>

        {/* Center links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => {
            const active = path === href
            return (
              <a
                key={label}
                href={href}
                className={`nav-link flex flex-col items-center text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                  active ? 'nav-link-active text-white' : 'text-silver/60 hover:text-white'
                }`}
              >
                {label}
              </a>
            )
          })}
        </nav>

        {/* Right icons + CTA */}
        <div className="flex items-center gap-3">
          <a
            href="/account"
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200"
            style={{ color: '#C1D1E0', opacity: 0.7 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#00F2FF'; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#C1D1E0'; e.currentTarget.style.opacity = '0.7' }}
          >
            <IconAccount />
          </a>
          <a
            href="/cart"
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors duration-200"
            style={{ color: '#C1D1E0', opacity: 0.7 }}
            onMouseEnter={e => { e.currentTarget.style.color = '#00F2FF'; e.currentTarget.style.opacity = '1' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#C1D1E0'; e.currentTarget.style.opacity = '0.7' }}
          >
            <IconCart />
          </a>
          <a
            href="/shop"
            className="hidden md:inline-flex items-center gap-2 rounded-full px-5 py-2 text-[12px] font-bold tracking-wide transition-all duration-200"
            style={{
              background: 'rgba(0,242,255,0.08)',
              border: '1px solid rgba(0,242,255,0.25)',
              color: '#00F2FF',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,242,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(0,242,255,0.5)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,242,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(0,242,255,0.25)' }}
          >
            Experience Danaco
            <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 6h8M6 2l4 4-4 4" />
            </svg>
          </a>
        </div>
      </header>

      {renderPage(path)}
    </div>
  )
}
