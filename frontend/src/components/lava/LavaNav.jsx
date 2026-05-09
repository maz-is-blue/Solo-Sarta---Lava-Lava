import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LavaWordmark from '../shared/LavaWordmark'
import { useCart } from '../../context/CartContext'

export default function LavaNav() {
  const [scrolled, setScrolled] = useState(false)
  const { cart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '14px 40px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.4s ease'
    }}>
      {/* Left: back */}
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.9)',
          cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500,
          letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6,
          padding: 0
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
      >
        ← BACK
      </button>

      {/* Center: wordmark */}
      <LavaWordmark size={26} />

      {/* Right: links + bag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {[['Collection', '/lava/collection'], ['Our Story', '/lava/story'], ['Contact', '/lava/contact']].map(([label, path]) => (
          <Link
            key={label}
            to={path}
            style={{
              color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
              fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, letterSpacing: 1.5,
              textTransform: 'uppercase', transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.9)'}
          >
            {label}
          </Link>
        ))}

        {/* BAG pill */}
        <div style={{
          background: 'rgba(255,255,255,0.9)', borderRadius: 999,
          padding: '7px 18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 1,
          color: '#7F58D4', transition: 'background 0.2s ease'
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#fff'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.9)'}
        >
          BAG · {cart.lava}
        </div>
      </div>
    </nav>
  )
}
