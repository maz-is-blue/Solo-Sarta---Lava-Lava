import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LavaWordmark from '../shared/LavaWordmark'
import { useCart } from '../../context/CartContext'
import { useMobile } from '../../hooks/useMobile'

const NAV_LINKS = [
  { label: 'Collection', path: '/lava/collection' },
  { label: 'Our Story', path: '/lava/story' },
  { label: 'Contact', path: '/lava/contact' },
]

function BagIcon({ color = 'rgba(255,255,255,0.9)' }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

export default function LavaNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { cart } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mobile = useMobile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: mobile ? '12px 20px' : '14px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.4s ease'
      }}>

        {/* Left: back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer', fontSize: mobile ? 12 : 13, fontFamily: 'DM Sans', fontWeight: 500,
            letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6, padding: 0, flexShrink: 0
          }}
        >
          ← {!mobile && 'BACK'}
        </button>

        {/* Center: wordmark */}
        <LavaWordmark size={mobile ? 20 : 26} />

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 16 : 28 }}>

          {/* Desktop links */}
          {!mobile && NAV_LINKS.map(({ label, path }) => (
            <span
              key={label}
              onClick={() => navigate(path)}
              style={{
                color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
                fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, letterSpacing: 1.5,
                textTransform: 'uppercase', transition: 'color 0.2s ease', cursor: 'pointer'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
            >
              {label}
            </span>
          ))}

          {/* Desktop BAG icon */}
          {!mobile && (
            <div
              onClick={() => navigate('/bag')}
              style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <BagIcon />
              {cart.lava > 0 && (
                <div style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#fff', color: '#8B6FB8',
                  fontSize: 9, fontWeight: 700, fontFamily: 'DM Sans',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cart.lava}
                </div>
              )}
            </div>
          )}

          {/* Mobile: bag icon + hamburger */}
          {mobile && (
            <>
              <div style={{ position: 'relative', cursor: 'pointer', display: 'flex' }} onClick={() => navigate('/bag')}>
                <BagIcon />
                {cart.lava > 0 && (
                  <div style={{
                    position: 'absolute', top: -5, right: -5,
                    width: 15, height: 15, borderRadius: '50%',
                    background: '#fff', color: '#8B6FB8',
                    fontSize: 8, fontWeight: 700, fontFamily: 'DM Sans',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {cart.lava}
                  </div>
                )}
              </div>

              <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
                <span style={{ display: 'block', width: 22, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 15, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 22, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Mobile sidebar */}
      {mobile && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.5)',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'all' : 'none',
              transition: 'opacity 0.3s ease'
            }}
          />

          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 201,
            width: 270,
            background: 'linear-gradient(160deg, #3a1a2e, #1e1030)',
            borderLeft: '1px solid rgba(255,255,255,0.12)',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 22px 28px' }}>
              <LavaWordmark size={22} />
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 20, padding: 4, lineHeight: 1, display: 'flex' }}>✕</button>
            </div>

            {/* Links */}
            {NAV_LINKS.map(({ label, path }) => {
              const active = pathname === path
              return (
                <div key={label} onClick={() => navigate(path)} style={{
                  padding: '17px 22px',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: active ? 'rgba(255,255,255,0.06)' : 'transparent'
                }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2.5, color: active ? '#fff' : 'rgba(255,255,255,0.65)' }}>
                    {label.toUpperCase()}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>→</span>
                </div>
              )
            })}

            <div style={{ flex: 1 }} />

            {/* Bottom */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 22px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.lava > 0 && (
                <div onClick={() => navigate('/bag')} style={{
                  background: 'rgba(255,255,255,0.9)', borderRadius: 999, padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                  marginBottom: 4
                }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2, fontWeight: 600, color: '#8B6FB8' }}>VIEW BAG</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, color: '#8B6FB8' }}>{cart.lava} item{cart.lava > 1 ? 's' : ''}</span>
                </div>
              )}
              <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>←</span>
                <span style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)' }}>BACK TO HOME</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
