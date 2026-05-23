import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import SoloNav from './SoloNav'

import { SOLO_PRODUCTS } from '../../data/soloProducts'

function GownSilhouette({ color1 = '#C9A96E', color2 = '#E8D5A3' }) {
  return (
    <svg width="120" height="200" viewBox="0 0 120 200" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="gownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} stopOpacity="0.7" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.5" />
        </linearGradient>
        <filter id="gownGlow">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Sketch lines for couture feel */}
      <path d="M45,20 Q42,12 60,8 Q78,12 75,20 L85,80 Q60,90 35,80 Z" fill="none" stroke={color1} strokeWidth="0.8" opacity="0.4" />
      <path d="M35,80 Q10,130 20,195 Q60,200 100,195 Q110,130 85,80" fill="none" stroke={color1} strokeWidth="0.8" opacity="0.4" />
      {/* Main silhouette */}
      <path
        d="M45,20 Q42,12 60,8 Q78,12 75,20 L85,80 Q100,130 95,195 Q60,200 25,195 Q20,130 35,80 Z"
        fill="url(#gownGrad)" opacity="0.85" filter="url(#gownGlow)"
      />
      {/* Straps */}
      <line x1="52" y1="8" x2="48" y2="20" stroke={color1} strokeWidth="1.5" opacity="0.6" />
      <line x1="68" y1="8" x2="72" y2="20" stroke={color1} strokeWidth="1.5" opacity="0.6" />
      {/* Waist line */}
      <path d="M38,78 Q60,86 82,78" fill="none" stroke={color1} strokeWidth="0.8" opacity="0.5" />
      {/* Sparkles */}
      {[40, 75, 55, 85, 30].map((x, i) => (
        <circle key={i} cx={x} cy={40 + i * 30} r={1} fill={color1} opacity={0.5}
          style={{ animation: `sparkle ${1.8 + i * 0.3}s ${i * 0.4}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  )
}

function NeedleMotif() {
  return (
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      border: '1px solid rgba(201,169,110,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'spin 24s linear infinite'
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" fill="none" stroke="#C9A96E" strokeWidth="0.8" />
        <line x1="12" y1="2" x2="12" y2="9" stroke="#C9A96E" strokeWidth="1" />
        <line x1="12" y1="15" x2="12" y2="22" stroke="#C9A96E" strokeWidth="1" opacity="0.4" />
      </svg>
    </div>
  )
}

function SoloProductCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/solo/piece/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: 4,
        background: 'linear-gradient(135deg, #2E2822 0%, #201C18 100%)',
        border: '1px solid rgba(201,169,110,0.12)',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.4)',
        minHeight: 280
      }}
    >
      {/* Grain texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        backgroundSize: 'cover'
      }} />
      {/* Product code */}
      <div style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans' }}>
        {product.code}
      </div>
      {/* Silhouette area */}
      <div style={{
        height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(201,169,110,0.05), rgba(201,169,110,0.02))'
      }}>
        <GownSilhouette />
      </div>
      {/* Hover reveal */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '20px 20px',
        background: 'linear-gradient(0deg, rgba(28,24,20,0.98) 0%, rgba(28,24,20,0.7) 100%)',
        transform: hovered ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s ease'
      }}>
        <div style={{ fontSize: 12, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', letterSpacing: 1, marginBottom: 4 }}>{product.cat.toUpperCase()}</div>
        <div style={{ fontSize: 17, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 4 }}>{product.name}</div>
        <div style={{ fontSize: 14, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12 }}>₹{product.price.toLocaleString()}</div>
        <button
          onClick={() => { addItem('solo', product, 'Bespoke'); setAdded(true); setTimeout(() => setAdded(false), 2000) }}
          style={{
            padding: '8px 20px', borderRadius: 2, border: '1px solid #C9A96E', cursor: 'pointer',
            background: added ? '#C9A96E' : 'transparent', color: added ? '#1A1A1A' : '#C9A96E',
            fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 1.5, transition: 'all 0.25s ease'
          }}
        >
          {added ? '✓ ADDED' : 'ADD TO ATELIER BAG'}
        </button>
      </div>
    </div>
  )
}

export default function SoloPage() {
  const navigate = useNavigate()
  const [inviteEmail, setInviteEmail] = useState('')
  const [invited, setInvited] = useState(false)

  return (
    <div style={{ background: '#2A2420', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      {/* Grain */}
      <div style={{
        position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        backgroundSize: 'cover'
      }} />

      <SoloNav />

      {/* Hero */}
      <section style={{ paddingTop: 100, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, position: 'relative', zIndex: 1 }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px 80px 80px' }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 24 }}>
            AUTUMN / WINTER '26
          </div>
          <h1 style={{
            fontSize: 56, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300,
            lineHeight: 1.1, marginBottom: 28, color: '#FAF8F5'
          }}>
            Crafted for those who wear their story.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.6)', fontFamily: 'DM Sans', lineHeight: 1.8, maxWidth: 420, marginBottom: 40 }}>
            A private atelier of 11 master tailors. Bespoke couture since 2018.
          </p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 56 }}>
            <button
              onClick={() => navigate('/solo/collection')}
              style={{
                padding: '13px 32px', borderRadius: 2, border: 'none', cursor: 'pointer',
                background: '#C9A96E', color: '#1A1A1A',
                fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2
              }}>
              EXPLORE COLLECTION
            </button>
            <button
              onClick={() => navigate('/solo/contact')}
              style={{
                padding: '13px 32px', borderRadius: 2, border: '1px solid rgba(201,169,110,0.4)', cursor: 'pointer',
                background: 'transparent', color: '#C9A96E',
                fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.1)'; e.currentTarget.style.borderColor = '#C9A96E' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)' }}
            >
              BOOK A CONSULTATION
            </button>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: 32 }}>
            {[['148', 'Pieces / Year'], ['11', 'Master Tailors'], ['Est. 2018', '']].map(([num, label], i) => (
              <div key={num} style={{ flex: 1, paddingRight: 24, borderRight: i < 2 ? '1px solid rgba(201,169,110,0.12)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontSize: 28, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#C9A96E', marginBottom: 4 }}>{num}</div>
                {label && <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans' }}>{label.toUpperCase()}</div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 80px 80px 40px', position: 'relative' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #302A24 0%, #201C18 100%)',
            border: '1px solid rgba(201,169,110,0.15)',
            borderRadius: 4, padding: '48px 40px', width: '100%', maxWidth: 440,
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Background glow */}
            <div style={{
              position: 'absolute', width: 300, height: 300, top: -80, right: -60,
              background: 'radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)',
              filter: 'blur(40px)', pointerEvents: 'none'
            }} />
            {/* Look label */}
            <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', marginBottom: 24 }}>LOOK 01</div>
            {/* Gown silhouette */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
              <GownSilhouette color1="#C9A96E" color2="#E8D5A3" />
            </div>
            {/* Quote card */}
            <div style={{
              background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.12)',
              padding: '16px 20px', borderRadius: 2, marginBottom: 24
            }}>
              <p style={{ fontSize: 13, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'rgba(250,248,245,0.7)', lineHeight: 1.7, marginBottom: 8 }}>
                "Each piece begins as a conversation."
              </p>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans' }}>— MAISON NOTES</div>
            </div>
            {/* Needle motif */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <NeedleMotif />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Story section */}
      <section style={{ padding: '80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #2E2822, #211D19)', border: '1px solid rgba(201,169,110,0.1)',
            borderRadius: 4, height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', width: 300, height: 300, top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)',
              filter: 'blur(40px)'
            }} />
            <GownSilhouette color1="#C9A96E" color2="#FAF8F5" />
            <div style={{ position: 'absolute', bottom: 24, left: 24, fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans' }}>AW/26 — ATELIER</div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 20 }}>THE CRAFT</div>
          <h2 style={{ fontSize: 40, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
            The quiet art of the<br />made-to-measure.
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.6)', fontFamily: 'DM Sans', lineHeight: 1.9, marginBottom: 20 }}>
            Every Solo Sarto piece begins with a measurement and ends with a story. Our eleven master tailors work exclusively by appointment, shaping each garment to the exact contour of who will wear it.
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.9 }}>
            We have never made two identical pieces. We never will.
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 24 }}>
            <button
              onClick={() => navigate('/solo/story')}
              style={{
                padding: '11px 28px', borderRadius: 2, border: '1px solid #C9A96E', cursor: 'pointer',
                background: 'transparent', color: '#C9A96E', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 1.5
              }}>
              OUR STORY
            </button>
          </div>
        </motion.div>
      </section>

      {/* Collection grid */}
      <section style={{ padding: '0 80px 80px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 48 }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12 }}>AUTUMN / WINTER '26</div>
          <h2 style={{ fontSize: 44, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400 }}>The Collection</h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {SOLO_PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <SoloProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer band */}
      <section style={{ background: '#FAF8F5', padding: '64px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(26,26,26,0.4)', fontFamily: 'DM Sans', marginBottom: 16 }}>
          THE PRIVATE CIRCLE
        </div>
        <h3 style={{ fontSize: 32, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#1A1A1A', marginBottom: 8 }}>
          For an invitation to the next private viewing.
        </h3>
        <p style={{ fontSize: 14, color: 'rgba(26,26,26,0.55)', fontFamily: 'DM Sans', marginBottom: 32 }}>
          By invitation only. Three showings per season.
        </p>
        {invited ? (
          <div style={{ fontSize: 16, color: '#C9A96E', fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>
            Your request has been received. We will be in touch.
          </div>
        ) : (
          <form
            onSubmit={e => { e.preventDefault(); setInvited(true) }}
            style={{ display: 'flex', gap: 0, maxWidth: 460, margin: '0 auto' }}
          >
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              required
              placeholder="your@email.com"
              style={{
                flex: 1, padding: '14px 20px', border: '1px solid rgba(26,26,26,0.2)', borderRight: 'none',
                background: '#fff', color: '#1A1A1A', fontSize: 14, fontFamily: 'DM Sans', outline: 'none',
                borderRadius: '2px 0 0 2px'
              }}
            />
            <button type="submit" style={{
              padding: '14px 28px', border: 'none', cursor: 'pointer',
              background: '#C9A96E', color: '#1A1A1A',
              fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2,
              borderRadius: '0 2px 2px 0', whiteSpace: 'nowrap'
            }}>
              REQUEST INVITATION
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
