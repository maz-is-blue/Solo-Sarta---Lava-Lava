import { useNavigate } from 'react-router-dom'
import { useMobile } from '../../hooks/useMobile'

export default function SoloFooter() {
  const navigate = useNavigate()
  const mobile = useMobile()

  const COLUMNS = [
    {
      heading: 'Atelier',
      links: [
        { label: 'The Collection', path: '/solo/collection' },
        { label: 'Bespoke Atelier', path: '/solo' },
        { label: 'Book a Consultation', path: '/solo/contact' },
      ],
    },
    {
      heading: 'Story',
      links: [
        { label: 'Our Story', path: '/solo/story' },
        { label: 'The Craft', path: '/solo/story' },
        { label: 'Press', path: '/solo/contact' },
      ],
    },
    {
      heading: 'Contact',
      links: [
        { label: 'Enquiries', path: '/solo/contact' },
        { label: 'Private Viewing', path: '/solo/contact' },
        { label: 'Lava Lava', path: '/lava' },
      ],
    },
  ]

  return (
    <footer style={{
      background: '#1C1814',
      borderTop: '1px solid rgba(201,169,110,0.1)',
      padding: mobile ? '40px 24px 28px' : '56px 80px 36px',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
        gap: mobile ? 28 : 48,
        marginBottom: 40,
      }}>
        {/* Brand column */}
        <div style={{ gridColumn: mobile ? '1 / -1' : 'auto' }}>
          <div
            onClick={() => navigate('/solo')}
            style={{ cursor: 'pointer', display: 'inline-block', marginBottom: 16 }}
          >
            <img
              src={`${import.meta.env.BASE_URL}assets/solo-logo-nav.png`}
              alt="Solo Sarto"
              style={{ height: 40, width: 'auto', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(65%) sepia(39%) saturate(590%) hue-rotate(335deg) brightness(105%)' }}
            />
          </div>
          <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.4)', lineHeight: 1.8, maxWidth: 260 }}>
            A private atelier of 11 master tailors.<br />Bespoke couture since 2018. By appointment only.
          </p>
        </div>

        {/* Link columns */}
        {COLUMNS.map(({ heading, links }) => (
          <div key={heading}>
            <div style={{ fontSize: 10, letterSpacing: 2.5, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', marginBottom: 16 }}>
              {heading.toUpperCase()}
            </div>
            {links.map(({ label, path }) => (
              <div
                key={label}
                onClick={() => navigate(path)}
                style={{ fontSize: 13, color: 'rgba(250,248,245,0.5)', marginBottom: 12, cursor: 'pointer', transition: 'color 0.2s ease' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,248,245,0.5)'}
              >
                {label}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        borderTop: '1px solid rgba(201,169,110,0.08)',
        paddingTop: 20,
        display: 'flex',
        flexDirection: mobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: mobile ? 'flex-start' : 'center',
        gap: mobile ? 12 : 0,
      }}>
        <span style={{ fontSize: 12, color: 'rgba(250,248,245,0.2)', fontFamily: 'DM Sans' }}>
          © 2026 Solo Sarto. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['✦ Instagram', '✦ Pinterest'].map(s => (
            <span
              key={s}
              style={{ fontSize: 12, color: 'rgba(250,248,245,0.3)', cursor: 'pointer', fontFamily: 'DM Sans', transition: 'color 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,248,245,0.3)'}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
