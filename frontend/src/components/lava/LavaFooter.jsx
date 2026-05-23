import LavaWordmark from '../shared/LavaWordmark'

export default function LavaFooter() {
  return (
    <footer style={{
      background: 'rgba(0,0,0,0.6)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '48px 80px 32px',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 40 }}>
        <div>
          <LavaWordmark size={32} dark={true} style={{ marginBottom: 16 }} />
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
            <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
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
        borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
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
