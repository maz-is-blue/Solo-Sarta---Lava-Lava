import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LavaWordmark from '../shared/LavaWordmark'
import { useMobile } from '../../hooks/useMobile'

function SoloDressSketch() {
  return (
    <svg width="160" height="260" viewBox="0 0 160 260" style={{ overflow: 'visible' }}>
      <defs>
        <style>{`
          .dress-path {
            stroke-dasharray: 800;
            stroke-dashoffset: 800;
            animation: drawIn 2s ease forwards 0.5s;
          }
        `}</style>
      </defs>
      <path className="dress-path" d="M65,25 Q62,15 80,10 Q98,15 95,25 L105,80 Q80,90 55,80 Z" fill="none" stroke="rgba(201,169,110,0.6)" strokeWidth="1" />
      <path className="dress-path" d="M55,80 Q20,140 15,255 Q80,262 145,255 Q140,140 105,80" fill="none" stroke="rgba(201,169,110,0.6)" strokeWidth="1" />
      <path className="dress-path" d="M72,10 L66,24" fill="none" stroke="rgba(201,169,110,0.5)" strokeWidth="1" />
      <path className="dress-path" d="M88,10 L94,24" fill="none" stroke="rgba(201,169,110,0.5)" strokeWidth="1" />
      <path className="dress-path" d="M57,78 Q80,88 103,78" fill="none" stroke="rgba(201,169,110,0.4)" strokeWidth="0.8" />
      <path className="dress-path" d="M17,248 Q80,256 143,248" fill="none" stroke="rgba(201,169,110,0.3)" strokeWidth="0.8" />
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [soloHover, setSoloHover] = useState(false)
  const [lavaHover, setLavaHover] = useState(false)
  const mobile = useMobile()

  useEffect(() => { setMounted(true) }, [])

  const SPARKLES = [
    { x: '15%', y: '20%', size: 8, delay: 0.3 },
    { x: '80%', y: '15%', size: 6, delay: 0.7 },
    { x: '70%', y: '70%', size: 10, delay: 1.1 },
    { x: '25%', y: '75%', size: 5, delay: 0.5 },
    { x: '55%', y: '30%', size: 7, delay: 0.9 },
    { x: '90%', y: '55%', size: 6, delay: 1.4 },
    { x: '40%', y: '85%', size: 8, delay: 0.2 },
    { x: '85%', y: '40%', size: 5, delay: 1.8 },
  ]

  return (
    <div className="landing-wrap">

      {/* Solo Sarto — Top on mobile, Left on desktop */}
      <div
        className="landing-panel"
        onClick={() => navigate('/solo')}
        onMouseEnter={() => setSoloHover(true)}
        onMouseLeave={() => setSoloHover(false)}
        style={{
          background: '#FFFFFF', cursor: 'pointer',
          transition: 'transform 0.5s ease',
          transform: soloHover ? 'scale(1.02)' : 'scale(1)',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          backgroundSize: 'cover'
        }} />
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(201,169,110,0.06)',
          opacity: soloHover ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none'
        }} />

        <div className="landing-eyebrow" style={{
          fontSize: 10, letterSpacing: 4, color: 'rgba(201,169,110,0.8)', fontFamily: 'DM Sans',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.2s'
        }}>
          THE ATELIER
        </div>

        <div className="landing-logo-wrap" style={{
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.2s'
        }}>
          <img
            src={`${import.meta.env.BASE_URL}assets/solo-logo-white.jpg`}
            alt="Solo Sarto"
            className="landing-logo-img"
          />
        </div>

        <button
          className="landing-btn"
          onClick={e => { e.stopPropagation(); navigate('/solo') }}
          style={{
            border: `1px solid ${soloHover ? '#C9A96E' : 'rgba(26,26,26,0.3)'}`,
            background: soloHover ? '#C9A96E' : 'transparent',
            color: soloHover ? '#FAF8F5' : '#1A1A1A',
            fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2,
            transition: 'all 0.3s ease',
            opacity: mounted ? 1 : 0,
          }}
        >
          ENTER SOLO SARTO
        </button>

        <div className="landing-label-desktop" style={{
          position: 'absolute', bottom: 40, left: 40,
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.6s'
        }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.8)', fontFamily: 'DM Sans', marginBottom: 4 }}>ATELIER · EST. 2018</div>
          <div style={{ fontSize: 14, letterSpacing: 1.5, color: 'rgba(26,26,26,0.35)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>Bespoke / Couture</div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="landing-divider"
        style={{
          background: 'rgba(255,255,255,0.35)',
          transition: 'transform 0.6s ease 1.2s',
          ...(mobile
            ? { transformOrigin: 'left', transform: mounted ? 'scaleX(1)' : 'scaleX(0)' }
            : { transformOrigin: 'top', transform: mounted ? 'scaleY(1)' : 'scaleY(0)' }
          ),
        }}
      />

      {/* Lava Lava — Bottom on mobile, Right on desktop */}
      <div
        className="landing-panel"
        onClick={() => navigate('/lava')}
        onMouseEnter={() => setLavaHover(true)}
        onMouseLeave={() => setLavaHover(false)}
        style={{
          cursor: 'pointer',
          transition: 'transform 0.5s ease',
          transform: lavaHover ? 'scale(1.02)' : 'scale(1)',
          background: 'linear-gradient(135deg, #E8906A, #D96A8A, #8B6FB8)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 12s ease infinite',
        }}
      >
        <div style={{
          position: 'absolute', width: 500, height: 500, top: '-15%', left: '-10%', borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(232,144,106,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)', animation: 'aura1 14s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, bottom: '-10%', right: '-10%', borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(139,111,184,0.5) 0%, transparent 70%)',
          filter: 'blur(50px)', animation: 'aura2 18s ease-in-out infinite'
        }} />

        {SPARKLES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: s.x, top: s.y, pointerEvents: 'none',
            animation: `sparkle ${1.5 + i * 0.2}s ${s.delay}s ease-in-out infinite`
          }}>
            <svg width={s.size} height={s.size} viewBox="0 0 10 10">
              <path d="M5,0 L5.8,3.8 L10,5 L5.8,6.2 L5,10 L4.2,6.2 L0,5 L4.2,3.8 Z" fill="rgba(255,255,255,0.7)" />
            </svg>
          </div>
        ))}

        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.05)',
          opacity: lavaHover ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none'
        }} />

        <div className="landing-eyebrow" style={{
          fontSize: 10, letterSpacing: 4, color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.2s'
        }}>
          DROP 04 · SOLAR BLOOM
        </div>

        <div className="landing-wordmark-wrap" style={{
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.2s'
        }}>
          <LavaWordmark size={mobile ? 64 : 110} animate={true} style={{ marginBottom: mobile ? 10 : 16 }} />
          <div style={{ fontSize: mobile ? 10 : 11, letterSpacing: 3, color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans' }}>
            THE DIFFUSION LINE
          </div>
        </div>

        <button
          className="landing-btn"
          onClick={e => { e.stopPropagation(); navigate('/lava') }}
          style={{
            border: '1px solid rgba(255,255,255,0.6)',
            background: lavaHover ? '#fff' : 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            color: lavaHover ? '#8B6FB8' : '#fff',
            fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2,
            transition: 'all 0.3s ease',
            opacity: mounted ? 1 : 0,
          }}
        >
          ENTER LAVA LAVA
        </button>

        <div className="landing-label-desktop" style={{
          position: 'absolute', bottom: 40, right: 40, textAlign: 'right',
          opacity: mounted ? 1 : 0, transition: 'opacity 0.8s ease 1.6s', zIndex: 1
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', marginBottom: 4 }}>READY-TO-WEAR</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: 'DM Sans' }}>For the fearless ✦</div>
        </div>
      </div>

    </div>
  )
}
