import LavaWordmark from '../shared/LavaWordmark'
import { useMobile } from '../../hooks/useMobile'

export default function LavaFooter() {
  const mobile = useMobile()

  return (
    <footer style={{
      background: 'rgba(0,0,0,0.6)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: mobile ? '40px 24px 24px' : '48px 80px 32px',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
        gap: mobile ? 24 : 40, marginBottom: 32
      }}>
        <div style={{ gridColumn: mobile ? '1 / -1' : 'auto' }}>
          <LavaWordmark size={28} dark={true} style={{ marginBottom: 14 }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: 260 }}>
            Drop 04 · Solar Bloom. A diffusion line by Solo Sarto.<br />For the fearless ✦
          </p>
        </div>
        {[
          ['Shop', ['New Arrivals', 'Collection', 'Drops', 'Collab']],
          ['House', ['Our Story', 'About Solo Sarto', 'Press', 'Careers']],
          ['Help', ['Contact', 'Sizing Guide', 'Shipping', 'Returns']],
        ].map(([heading, links]) => (
          <div key={heading}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>
              {heading.toUpperCase()}
            </div>
            {links.map(l => (
              <div
                key={l}
                style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 10, cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                {l}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 20,
        display: 'flex', flexDirection: mobile ? 'column' : 'row',
        justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center',
        gap: mobile ? 12 : 0
      }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2026 Lava Lava / Solo Sarto. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['✦ Instagram', '✦ Pinterest', '✦ TikTok'].map(s => (
            <span
              key={s}
              style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.color = '#D99AB4'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}
