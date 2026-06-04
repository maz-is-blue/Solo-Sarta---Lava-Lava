import { useNavigate } from 'react-router-dom'
import LavaWordmark from '../shared/LavaWordmark'
import { useMobile } from '../../hooks/useMobile'

export default function LavaFooter() {
  const navigate = useNavigate()
  const mobile = useMobile()

  const LINKS = [
    { label: 'Collection', path: '/lava/collection' },
    { label: 'Our Story', path: '/lava/story' },
    { label: 'Contact', path: '/lava/contact' },
    { label: 'Solo Sarto', path: '/solo' },
  ]

  return (
    <footer style={{
      background: 'rgba(0,0,0,0.6)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: mobile ? '40px 24px 24px' : '48px 80px 32px',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '2fr 1fr',
        gap: mobile ? 32 : 40, marginBottom: 32
      }}>
        <div>
          <div onClick={() => navigate('/lava')} style={{ cursor: 'pointer', display: 'inline-block', marginBottom: 14 }}>
            <LavaWordmark size={28} dark={true} />
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 260 }}>
            Drop 04 · Solar Bloom. A diffusion line by Solo Sarto.<br />For the fearless ✦
          </p>
        </div>

        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
            NAVIGATE
          </div>
          {LINKS.map(({ label, path }) => (
            <div
              key={label}
              onClick={() => navigate(path)}
              style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 10, cursor: 'pointer', transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20,
        display: 'flex', justifyContent: 'center',
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2026 Lava Lava / Solo Sarto. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
