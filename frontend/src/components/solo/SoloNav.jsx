import { useNavigate, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Atelier', path: '/solo' },
  { label: 'Collection', path: '/solo/collection' },
  { label: 'Story', path: '/solo/story' },
  { label: 'Contact', path: '/solo/contact' },
]

export default function SoloNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '20px 48px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(26,26,26,0.9)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,169,110,0.12)'
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', border: '1px solid rgba(201,169,110,0.3)', color: '#C9A96E',
          borderRadius: 2, padding: '6px 18px', cursor: 'pointer',
          fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 1.5
        }}
      >
        ← BACK
      </button>

      <img
        onClick={() => navigate('/solo')}
        src={`${import.meta.env.BASE_URL}assets/solo-logo-dark.jpg`}
        alt="Solo Sarto"
        style={{
          height: 46, width: 'auto', cursor: 'pointer',
          mixBlendMode: 'screen',
          filter: 'drop-shadow(0 0 12px rgba(201,169,110,0.3))'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {NAV_LINKS.map(({ label, path }) => {
          const active = pathname === path
          return (
            <span
              key={label}
              onClick={() => navigate(path)}
              style={{
                fontSize: 12, letterSpacing: 1.5, fontFamily: 'DM Sans', cursor: 'pointer',
                color: active ? '#C9A96E' : 'rgba(250,248,245,0.6)',
                borderBottom: active ? '1px solid rgba(201,169,110,0.6)' : '1px solid transparent',
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
