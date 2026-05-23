import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'Atelier', path: '/solo' },
  { label: 'Collection', path: '/solo/collection' },
  { label: 'Story', path: '/solo/story' },
  { label: 'Contact', path: '/solo/contact' },
]

export default function SoloNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: mobile ? '14px 24px' : '18px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(42,36,32,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,169,110,0.12)'
    }}>

      {/* Logo + "by Shiyam" — far left, grouped */}
      <div
        onClick={() => navigate('/solo')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', flexShrink: 0 }}
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/solo-logo-dark.jpg`}
          alt="Solo Sarto"
          style={{
            height: mobile ? 34 : 44, width: 'auto',
            mixBlendMode: 'screen',
            filter: 'drop-shadow(0 0 10px rgba(201,169,110,0.3))'
          }}
        />
        <span style={{
          fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300,
          fontSize: mobile ? 12 : 13, letterSpacing: 1,
          color: '#E8956D', whiteSpace: 'nowrap', lineHeight: 1
        }}>
          by Shiyam
        </span>
      </div>

      {/* Nav links — right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 18 : 32 }}>
        {NAV_LINKS.map(({ label, path }) => {
          const active = pathname === path
          return (
            <span
              key={label}
              onClick={() => navigate(path)}
              style={{
                fontSize: mobile ? 10 : 11, letterSpacing: mobile ? 1 : 1.5,
                fontFamily: 'DM Sans', cursor: 'pointer',
                color: active ? '#C9A96E' : 'rgba(250,248,245,0.6)',
                borderBottom: active ? '1px solid rgba(201,169,110,0.55)' : '1px solid transparent',
                paddingBottom: 2, transition: 'color 0.2s ease'
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#C9A96E' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(250,248,245,0.6)' }}
            >
              {label.toUpperCase()}
            </span>
          )
        })}
      </div>

    </nav>
  )
}
