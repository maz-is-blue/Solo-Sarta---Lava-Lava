import { useState, useEffect, useRef, useCallback } from 'react'
import { formatPrice } from '../../utils/price'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../../context/CartContext'
import SoloNav from './SoloNav'
import SoloFooter from './SoloFooter'
import { getProducts, getVideos } from '../../services/api'
import { useMobile } from '../../hooks/useMobile'
import { useContent } from '../../context/ContentContext'
import { useLanguage } from '../../context/LanguageContext'

function TailorAnimation() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #2E2822, #211D19)',
      border: '1px solid rgba(201,169,110,0.1)',
      borderRadius: 4, height: 400,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', width: 350, height: 350,
        top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }} />
      <svg width="240" height="240" viewBox="0 0 240 240" style={{ overflow: 'visible' }}>
        <defs>
          <style>{`
            .ta-outer { transform-origin: 120px 120px; animation: taRot 45s linear infinite; }
            .ta-inner { transform-origin: 120px 120px; animation: taRot 28s linear infinite reverse; }
            .ta-needle { transform-origin: 120px 120px; animation: taRot 10s linear infinite; }
            .ta-stitch { stroke-dasharray: 8 5; animation: taStitch 1.8s linear infinite; }
            .ta-pulse { animation: taPulse 2.5s ease-in-out infinite; }
            @keyframes taRot { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes taStitch { from { stroke-dashoffset: 52; } to { stroke-dashoffset: 0; } }
            @keyframes taPulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.8; } }
          `}</style>
        </defs>
        <g className="ta-outer">
          <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(201,169,110,0.10)" strokeWidth="0.8" />
          {[...Array(48)].map((_, i) => {
            const a = (i * 7.5) * Math.PI / 180
            const r1 = i % 4 === 0 ? 97 : 100
            return (
              <line key={i}
                x1={120 + r1 * Math.cos(a)} y1={120 + r1 * Math.sin(a)}
                x2={120 + 107 * Math.cos(a)} y2={120 + 107 * Math.sin(a)}
                stroke={`rgba(201,169,110,${i % 4 === 0 ? 0.45 : 0.2})`}
                strokeWidth={i % 4 === 0 ? 1.2 : 0.6}
              />
            )
          })}
        </g>
        <g className="ta-inner">
          <circle cx="120" cy="120" r="70" fill="none" stroke="rgba(201,169,110,0.15)" strokeWidth="0.8" strokeDasharray="3 9" />
        </g>
        <circle cx="120" cy="120" r="46" fill="none" stroke="rgba(201,169,110,0.30)" strokeWidth="1" className="ta-stitch" />
        <g className="ta-needle">
          <rect x="119" y="30" width="2" height="72" rx="1" fill="#C9A96E" opacity="0.75" />
          <polygon points="120,16 117.5,32 122.5,32" fill="#C9A96E" opacity="0.9" />
          <ellipse cx="120" cy="38" rx="2.5" ry="4" fill="none" stroke="#C9A96E" strokeWidth="1.2" opacity="0.65" />
          <line x1="120" y1="102" x2="120" y2="118" stroke="rgba(201,169,110,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        </g>
        <circle cx="120" cy="120" r="6" fill="none" stroke="#C9A96E" strokeWidth="1" opacity="0.4" className="ta-pulse" />
        <circle cx="120" cy="120" r="2.5" fill="#C9A96E" opacity="0.8" />
        {[0, 90, 180, 270].map((deg, i) => {
          const a = deg * Math.PI / 180
          return (
            <circle key={i}
              cx={120 + 70 * Math.cos(a)} cy={120 + 70 * Math.sin(a)}
              r="2.5" fill="#C9A96E"
              style={{ animation: `taPulse 2s ${i * 0.5}s ease-in-out infinite` }}
            />
          )
        })}
        <line x1="48" y1="120" x2="74" y2="120" stroke="rgba(201,169,110,0.15)" strokeWidth="0.8" />
        <line x1="166" y1="120" x2="192" y2="120" stroke="rgba(201,169,110,0.15)" strokeWidth="0.8" />
        <line x1="120" y1="48" x2="120" y2="74" stroke="rgba(201,169,110,0.15)" strokeWidth="0.8" />
        <line x1="120" y1="166" x2="120" y2="192" stroke="rgba(201,169,110,0.15)" strokeWidth="0.8" />
      </svg>
      <div style={{ position: 'absolute', bottom: 24, left: 24, fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans' }}>AW/26 — ATELIER</div>
      <div style={{ position: 'absolute', top: 24, right: 24, fontSize: 9, letterSpacing: 2, color: 'rgba(201,169,110,0.25)', fontFamily: 'DM Sans', textAlign: 'right', lineHeight: 1.8 }}>BESPOKE<br/>COUTURE</div>
    </div>
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

function SoloProductCard({ product, lang, t }) {
  const [hovered, setHovered] = useState(false)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const navigate = useNavigate()
  const displayName = (lang === 'ar' && product.name_ar) ? product.name_ar : product.name

  return (
    <div
      onClick={() => navigate(`/solo/piece/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Portrait image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#1A1612', marginBottom: 14 }}>
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={displayName}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(145deg, #211C17 0%, #1A1512 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 28, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: 'rgba(201,169,110,0.18)' }}>
              {product.code || 'SS'}
            </span>
          </div>
        )}

        {/* Quick-add on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(10,8,6,0.42)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          paddingBottom: 18,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: hovered ? 'auto' : 'none',
        }}>
          <button
            onClick={e => { e.stopPropagation(); addItem('solo', product, 'Bespoke'); setAdded(true); setTimeout(() => setAdded(false), 2000) }}
            style={{
              padding: '9px 24px',
              border: '1px solid rgba(201,169,110,0.65)',
              cursor: 'pointer',
              background: added ? '#C9A96E' : 'rgba(16,12,8,0.72)',
              backdropFilter: 'blur(8px)',
              color: added ? '#1A1A1A' : '#C9A96E',
              fontSize: 9, fontFamily: 'DM Sans', letterSpacing: 2.5,
              transition: 'all 0.25s ease',
            }}
          >
            {added ? '✓ ADDED' : 'QUICK ADD'}
          </button>
        </div>
      </div>

      {/* Info — editorial, clean */}
      <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.45)', fontFamily: 'DM Sans', marginBottom: 5 }}>
        {product.cat?.toUpperCase()}
      </div>
      <div style={{ fontSize: 17, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', lineHeight: 1.25, marginBottom: 5 }}>
        {displayName}
      </div>
      <div style={{ fontSize: 12, color: '#C9A96E', fontFamily: 'DM Sans', letterSpacing: 0.5 }}>
        {formatPrice(product.price, product.price_egp)}
      </div>
    </div>
  )
}

function EditorialSlider({ products, lang, t, mobile }) {
  const containerRef = useRef(null)
  const [offset, setOffset] = useState(0)
  const [cardPx, setCardPx] = useState(0)
  const GAP = mobile ? 12 : 20
  const perPage = mobile ? 2 : 4
  const total = products.length
  const maxOffset = Math.max(0, total - perPage)
  const paused = useRef(false)

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return
      const w = containerRef.current.offsetWidth
      setCardPx((w - GAP * (perPage - 1)) / perPage)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [GAP, perPage])

  useEffect(() => {
    if (total <= perPage) return
    const timer = setInterval(() => {
      if (!paused.current) setOffset(o => o >= maxOffset ? 0 : o + 1)
    }, 3500)
    return () => clearInterval(timer)
  }, [total, perPage, maxOffset])

  const translateX = cardPx ? -(offset * (cardPx + GAP)) : 0

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <div
        style={{ overflow: 'hidden', padding: '4px 0 8px' }}
        onMouseEnter={() => { paused.current = true }}
        onMouseLeave={() => { paused.current = false }}
      >
        <div style={{
          display: 'flex', gap: GAP,
          transform: `translateX(${translateX}px)`,
          transition: cardPx ? 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94)' : 'none',
          willChange: 'transform',
        }}>
          {products.map(p => (
            <div key={p.id} style={{ flex: `0 0 ${cardPx}px`, minWidth: 0 }}>
              <SoloProductCard product={p} lang={lang} t={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {maxOffset > 0 && [
        { dir: -1, side: 'left', label: '←', disabled: offset === 0 },
        { dir:  1, side: 'right', label: '→', disabled: offset >= maxOffset },
      ].map(({ dir, side, label, disabled }) => (
        <button
          key={side}
          onClick={() => setOffset(o => Math.max(0, Math.min(maxOffset, o + dir)))}
          style={{
            position: 'absolute', [side]: mobile ? -4 : -22, top: '38%',
            transform: 'translateY(-50%)',
            width: 40, height: 40, borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.3)',
            background: 'rgba(20,16,12,0.88)', backdropFilter: 'blur(8px)',
            color: '#C9A96E', fontSize: 15, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: disabled ? 0.25 : 1,
            transition: 'opacity 0.2s, border-color 0.2s',
            zIndex: 10,
          }}
          onMouseEnter={e => !disabled && (e.currentTarget.style.borderColor = '#C9A96E')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)')}
        >
          {label}
        </button>
      ))}

      {/* Dot nav */}
      {maxOffset > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
          {Array.from({ length: maxOffset + 1 }).map((_, i) => (
            <button key={i} onClick={() => setOffset(i)} style={{
              width: i === offset ? 24 : 6, height: 6, padding: 0, borderRadius: 999,
              background: i === offset ? '#C9A96E' : 'rgba(201,169,110,0.22)',
              border: 'none', cursor: 'pointer', transition: 'all 0.35s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

function CollectionSlider({ products, lang, t, mobile }) {
  const [active, setActive] = useState(0)
  const total = products.length
  const paused = useRef(false)
  const touchStart = useRef(null)

  const go = useCallback((dir) => {
    setActive(prev => (prev + dir + total) % total)
  }, [total])

  useEffect(() => {
    const timer = setInterval(() => { if (!paused.current) go(1) }, 4000)
    return () => clearInterval(timer)
  }, [go])

  const CARD_W = mobile ? 260 : 320
  const STEP = mobile ? 270 : 360

  return (
    <div
      style={{ position: 'relative', userSelect: 'none' }}
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}
      onTouchStart={e => { touchStart.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStart.current === null) return
        const dx = e.changedTouches[0].clientX - touchStart.current
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        touchStart.current = null
      }}
    >
      {/* Track */}
      <div style={{ position: 'relative', height: mobile ? 400 : 500, overflow: 'hidden' }}>
        {products.map((p, i) => {
          let d = i - active
          if (d > total / 2) d -= total
          if (d < -total / 2) d += total
          const abs = Math.abs(d)
          const scale = abs === 0 ? 1 : abs === 1 ? 0.78 : abs === 2 ? 0.60 : 0.46
          const opacity = abs === 0 ? 1 : abs === 1 ? 0.65 : abs === 2 ? 0.28 : 0
          const tx = d * STEP
          return (
            <div
              key={p.id}
              onClick={() => d !== 0 && go(Math.sign(d))}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${tx}px), -50%) scale(${scale})`,
                transformOrigin: 'center center',
                willChange: 'transform',
                transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s ease',
                width: CARD_W,
                zIndex: 20 - abs * 4,
                opacity,
                pointerEvents: abs <= 2 ? 'auto' : 'none',
                cursor: d !== 0 ? 'pointer' : 'default',
              }}
            >
              <SoloProductCard product={p} lang={lang} t={t} />
            </div>
          )
        })}
      </div>

      {/* Nav arrows */}
      {[{ dir: -1, side: 'left', arrow: '←' }, { dir: 1, side: 'right', arrow: '→' }].map(({ dir, side, arrow }) => (
        <button
          key={side}
          onClick={() => go(dir)}
          style={{
            position: 'absolute', [side]: mobile ? 8 : 28, top: '45%',
            transform: 'translateY(-50%)',
            background: 'rgba(26,22,18,0.75)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(201,169,110,0.3)', borderRadius: '50%',
            width: 44, height: 44, cursor: 'pointer',
            color: '#C9A96E', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 30, transition: 'background 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(201,169,110,0.18)'
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(26,22,18,0.75)'
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'
          }}
        >
          {arrow}
        </button>
      ))}

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? 24 : 6, height: 6, padding: 0, borderRadius: 999,
              background: i === active ? '#C9A96E' : 'rgba(201,169,110,0.25)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Baroque oval mirror ── */
function MirrorVideo({ video, loop, onEnded, mobile }) {
  // Fixed design space — SVG viewBox handles scaling
  const CX = 210, CY = 320, RX = 120, RY = 190
  const SW = 420, SH = 630

  const renderW = mobile ? 300 : 400
  const sc = renderW / SW
  const renderH = SH * sc

  // Video clip positions in rendered pixels
  const vx = (CX - RX) * sc, vy = (CY - RY) * sc
  const vw = RX * 2 * sc,    vh = RY * 2 * sc

  // Stroke style helpers
  const gold    = '#C9A96E'
  const goldFt  = 'rgba(201,169,110,0.55)'
  const goldDim = 'rgba(201,169,110,0.32)'

  const draw = (delay, dur = 0.85) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { duration: dur, ease: 'easeInOut', delay }, opacity: { duration: 0.3, delay } },
  })

  return (
    <div style={{ position: 'relative', width: renderW, height: renderH, flexShrink: 0 }}>

      {/* Breathing glow behind the oval */}
      <motion.div
        animate={{ opacity: [0.35, 0.75, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: vx - 24, top: vy - 24, width: vw + 48, height: vh + 48,
          background: 'radial-gradient(ellipse, rgba(201,169,110,0.22) 20%, transparent 72%)',
          filter: 'blur(32px)', borderRadius: '50%', pointerEvents: 'none',
        }}
      />

      {/* Video clipped to oval */}
      <div style={{
        position: 'absolute', left: vx, top: vy, width: vw, height: vh,
        clipPath: `ellipse(${RX * sc}px ${RY * sc}px at 50% 50%)`,
        overflow: 'hidden', background: '#1C1812',
      }}>
        {video.url ? (
          <video key={video.id} autoPlay muted playsInline loop={loop} onEnded={onEnded}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            src={video.url}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 40%, #2A2218 0%, #131009 100%)' }}>
            <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 48, color: 'rgba(201,169,110,0.08)', letterSpacing: 6 }}>SS</span>
          </div>
        )}
        {/* Mirror edge vignette */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(10,8,5,0.72) 100%)' }} />
      </div>

      {/* ── SVG baroque frame — all paths animate in sequence ── */}
      <svg viewBox={`0 0 ${SW} ${SH}`} width={renderW} height={renderH}
        style={{ position: 'absolute', top: 0, left: 0, overflow: 'visible', pointerEvents: 'none' }}>

        {/* === OVAL BORDER === */}
        {/* Outer hollow-light corona — thick blurred, draws then pulses */}
        <motion.ellipse cx={CX} cy={CY} rx={RX + 12} ry={RY + 12}
          fill="none" stroke="rgba(201,169,110,0.3)" strokeWidth={22}
          style={{ filter: 'blur(12px)' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: [null, 0.5, 1, 0.5] }}
          transition={{ pathLength: { duration: 2, delay: 0, ease: 'easeOut' }, opacity: { duration: 3.5, repeat: Infinity, delay: 2.3, ease: 'easeInOut' } }}
        />
        {/* Secondary softer glow */}
        <motion.ellipse cx={CX} cy={CY} rx={RX + 4} ry={RY + 4}
          fill="none" stroke="rgba(201,169,110,0.18)" strokeWidth={9}
          style={{ filter: 'blur(4px)' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.9, delay: 0.1, ease: 'easeOut' }}
        />
        {/* Main crisp gold border */}
        <motion.ellipse cx={CX} cy={CY} rx={RX} ry={RY}
          fill="none" stroke={gold} strokeWidth={1.3}
          {...draw(0.15, 1.9)} animate={{ pathLength: 1, opacity: 0.82 }}
        />
        {/* Inner fine ring */}
        <motion.ellipse cx={CX} cy={CY} rx={RX - 8} ry={RY - 8}
          fill="none" stroke={goldDim} strokeWidth={0.6}
          {...draw(0.4, 1.8)} animate={{ pathLength: 1, opacity: 1 }}
        />

        {/* === TOP CROWN === */}
        {/* Stem: oval top → cartouche */}
        <motion.path d="M 210,130 L 210,118" fill="none" stroke={goldFt} strokeWidth={0.9} {...draw(1.8, 0.25)} />

        {/* Center cartouche oval */}
        <motion.ellipse cx={210} cy={100} rx={17} ry={18}
          fill="rgba(201,169,110,0.05)" stroke={gold} strokeWidth={0.9}
          {...draw(1.95, 0.5)} animate={{ pathLength: 1, opacity: 0.75 }}
        />

        {/* Top finial above cartouche: elegant upward acanthus petal */}
        <motion.path d="M 210,82 L 210,68" fill="none" stroke={goldFt} strokeWidth={0.8} {...draw(2.35, 0.2)} />
        <motion.path
          d="M 210,68 C 205,60 199,50 203,42 C 207,34 213,34 217,42 C 221,50 215,60 210,68"
          fill="rgba(201,169,110,0.06)" stroke={gold} strokeWidth={0.85}
          {...draw(2.5, 0.45)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        {/* Small lateral leaves on finial */}
        <motion.path d="M 205,52 C 196,50 190,44 193,40 C 196,36 202,40 204,47" fill="none" stroke={goldDim} strokeWidth={0.7} {...draw(2.7, 0.35)} />
        <motion.path d="M 215,52 C 224,50 230,44 227,40 C 224,36 218,40 216,47" fill="none" stroke={goldDim} strokeWidth={0.7} {...draw(2.7, 0.35)} />

        {/* LEFT inner S-scroll from cartouche */}
        <motion.path
          d="M 193,100 C 178,95 160,80 148,90 C 136,100 130,118 140,127 C 150,136 165,128 162,116"
          fill="none" stroke={gold} strokeWidth={1.0}
          {...draw(2.2, 0.8)} animate={{ pathLength: 1, opacity: 0.75 }}
        />
        {/* LEFT outer big sweep + coil */}
        <motion.path
          d="M 148,90 C 130,77 113,52 121,34 C 129,16 151,20 150,38 C 149,56 135,59 125,50"
          fill="none" stroke={gold} strokeWidth={1.0}
          {...draw(2.6, 0.85)} animate={{ pathLength: 1, opacity: 0.72 }}
        />
        {/* LEFT outer coil tight end */}
        <motion.path
          d="M 125,50 C 118,43 116,34 121,30 C 126,26 132,30 131,37"
          fill="none" stroke={goldFt} strokeWidth={0.8}
          {...draw(3.1, 0.35)} animate={{ pathLength: 1, opacity: 0.65 }}
        />
        {/* LEFT scroll tail droop */}
        <motion.path
          d="M 162,116 C 161,128 153,136 145,130"
          fill="none" stroke={goldDim} strokeWidth={0.75}
          {...draw(3.0, 0.3)} animate={{ pathLength: 1, opacity: 0.6 }}
        />
        {/* LEFT lower decorative leaf off the S */}
        <motion.path
          d="M 140,112 C 128,110 118,118 122,126 C 126,134 136,130 138,122"
          fill="none" stroke={goldDim} strokeWidth={0.7}
          {...draw(3.15, 0.35)} animate={{ pathLength: 1, opacity: 0.55 }}
        />

        {/* RIGHT inner S-scroll (mirror) */}
        <motion.path
          d="M 227,100 C 242,95 260,80 272,90 C 284,100 290,118 280,127 C 270,136 255,128 258,116"
          fill="none" stroke={gold} strokeWidth={1.0}
          {...draw(2.2, 0.8)} animate={{ pathLength: 1, opacity: 0.75 }}
        />
        {/* RIGHT outer big sweep + coil */}
        <motion.path
          d="M 272,90 C 290,77 307,52 299,34 C 291,16 269,20 270,38 C 271,56 285,59 295,50"
          fill="none" stroke={gold} strokeWidth={1.0}
          {...draw(2.6, 0.85)} animate={{ pathLength: 1, opacity: 0.72 }}
        />
        {/* RIGHT outer coil tight end */}
        <motion.path
          d="M 295,50 C 302,43 304,34 299,30 C 294,26 288,30 289,37"
          fill="none" stroke={goldFt} strokeWidth={0.8}
          {...draw(3.1, 0.35)} animate={{ pathLength: 1, opacity: 0.65 }}
        />
        {/* RIGHT scroll tail droop */}
        <motion.path
          d="M 258,116 C 259,128 267,136 275,130"
          fill="none" stroke={goldDim} strokeWidth={0.75}
          {...draw(3.0, 0.3)} animate={{ pathLength: 1, opacity: 0.6 }}
        />
        {/* RIGHT lower decorative leaf */}
        <motion.path
          d="M 280,112 C 292,110 302,118 298,126 C 294,134 284,130 282,122"
          fill="none" stroke={goldDim} strokeWidth={0.7}
          {...draw(3.15, 0.35)} animate={{ pathLength: 1, opacity: 0.55 }}
        />

        {/* === LEFT SIDE VOLUTES === */}
        {/* Upper-left volute */}
        <motion.path
          d="M 90,308 C 70,295 54,268 63,249 C 72,230 92,234 90,252 C 88,270 74,272 68,262"
          fill="none" stroke={gold} strokeWidth={0.95}
          {...draw(2.95, 0.75)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        {/* Upper-left coil end */}
        <motion.path
          d="M 68,262 C 64,255 65,247 70,245 C 75,243 79,249 76,255"
          fill="none" stroke={goldFt} strokeWidth={0.75}
          {...draw(3.45, 0.3)} animate={{ pathLength: 1, opacity: 0.6 }}
        />
        {/* Lower-left volute */}
        <motion.path
          d="M 90,332 C 70,345 54,372 63,391 C 72,410 92,406 90,388 C 88,370 74,368 68,378"
          fill="none" stroke={gold} strokeWidth={0.95}
          {...draw(3.05, 0.75)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        {/* Lower-left coil end */}
        <motion.path
          d="M 68,378 C 64,385 65,393 70,395 C 75,397 79,391 76,385"
          fill="none" stroke={goldFt} strokeWidth={0.75}
          {...draw(3.55, 0.3)} animate={{ pathLength: 1, opacity: 0.6 }}
        />
        {/* Left side leaf cluster between volutes */}
        <motion.path
          d="M 78,318 C 66,316 58,322 62,330 C 66,338 76,334 78,326"
          fill="none" stroke={goldDim} strokeWidth={0.7}
          {...draw(3.6, 0.3)} animate={{ pathLength: 1, opacity: 0.5 }}
        />

        {/* === RIGHT SIDE VOLUTES (mirror) === */}
        <motion.path
          d="M 330,308 C 350,295 366,268 357,249 C 348,230 328,234 330,252 C 332,270 346,272 352,262"
          fill="none" stroke={gold} strokeWidth={0.95}
          {...draw(2.95, 0.75)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        <motion.path
          d="M 352,262 C 356,255 355,247 350,245 C 345,243 341,249 344,255"
          fill="none" stroke={goldFt} strokeWidth={0.75}
          {...draw(3.45, 0.3)} animate={{ pathLength: 1, opacity: 0.6 }}
        />
        <motion.path
          d="M 330,332 C 350,345 366,372 357,391 C 348,410 328,406 330,388 C 332,370 346,368 352,378"
          fill="none" stroke={gold} strokeWidth={0.95}
          {...draw(3.05, 0.75)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        <motion.path
          d="M 352,378 C 356,385 355,393 350,395 C 345,397 341,391 344,385"
          fill="none" stroke={goldFt} strokeWidth={0.75}
          {...draw(3.55, 0.3)} animate={{ pathLength: 1, opacity: 0.6 }}
        />
        <motion.path
          d="M 342,318 C 354,316 362,322 358,330 C 354,338 344,334 342,326"
          fill="none" stroke={goldDim} strokeWidth={0.7}
          {...draw(3.6, 0.3)} animate={{ pathLength: 1, opacity: 0.5 }}
        />

        {/* === BOTTOM MEDALLION === */}
        {/* Stem from oval bottom */}
        <motion.path d="M 210,510 L 210,526" fill="none" stroke={goldFt} strokeWidth={0.9} {...draw(3.2, 0.25)} />
        {/* Medallion outer circle */}
        <motion.ellipse cx={210} cy={545} rx={19} ry={19}
          fill="rgba(201,169,110,0.05)" stroke={gold} strokeWidth={0.9}
          {...draw(3.35, 0.5)} animate={{ pathLength: 1, opacity: 0.72 }}
        />
        {/* Medallion inner ring */}
        <motion.ellipse cx={210} cy={545} rx={11} ry={11}
          fill="none" stroke={goldDim} strokeWidth={0.6}
          {...draw(3.65, 0.4)} animate={{ pathLength: 1, opacity: 0.6 }}
        />

        {/* Left bottom scroll */}
        <motion.path
          d="M 191,545 C 170,543 150,528 143,547 C 136,566 149,580 167,573 C 185,566 181,550 167,547"
          fill="none" stroke={gold} strokeWidth={0.95}
          {...draw(3.5, 0.75)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        {/* Left bottom outer curl */}
        <motion.path
          d="M 143,547 C 125,547 110,561 115,576 C 120,591 136,588 138,574"
          fill="none" stroke={goldFt} strokeWidth={0.8}
          {...draw(3.85, 0.5)} animate={{ pathLength: 1, opacity: 0.62 }}
        />
        {/* Left bottom curl end */}
        <motion.path
          d="M 115,576 C 112,583 114,591 119,592 C 124,593 127,587 124,582"
          fill="none" stroke={goldDim} strokeWidth={0.7}
          {...draw(4.1, 0.3)} animate={{ pathLength: 1, opacity: 0.52 }}
        />

        {/* Right bottom scroll (mirror) */}
        <motion.path
          d="M 229,545 C 250,543 270,528 277,547 C 284,566 271,580 253,573 C 235,566 239,550 253,547"
          fill="none" stroke={gold} strokeWidth={0.95}
          {...draw(3.5, 0.75)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        {/* Right bottom outer curl */}
        <motion.path
          d="M 277,547 C 295,547 310,561 305,576 C 300,591 284,588 282,574"
          fill="none" stroke={goldFt} strokeWidth={0.8}
          {...draw(3.85, 0.5)} animate={{ pathLength: 1, opacity: 0.62 }}
        />
        {/* Right bottom curl end */}
        <motion.path
          d="M 305,576 C 308,583 306,591 301,592 C 296,593 293,587 296,582"
          fill="none" stroke={goldDim} strokeWidth={0.7}
          {...draw(4.1, 0.3)} animate={{ pathLength: 1, opacity: 0.52 }}
        />

        {/* === BOTTOM PENDANT === */}
        <motion.path d="M 210,564 L 210,580" fill="none" stroke={goldFt} strokeWidth={0.85} {...draw(3.9, 0.22)} />
        {/* Teardrop pendant */}
        <motion.path
          d="M 210,580 C 204,588 201,600 210,607 C 219,614 216,600 210,580"
          fill="rgba(201,169,110,0.07)" stroke={gold} strokeWidth={0.9}
          {...draw(3.95, 0.45)} animate={{ pathLength: 1, opacity: 0.68 }}
        />
        {/* Tiny drop below */}
        <motion.path d="M 210,607 L 210,618" fill="none" stroke={goldDim} strokeWidth={0.7} {...draw(4.2, 0.18)} />
      </svg>
    </div>
  )
}

export default function SoloPage() {
  const navigate = useNavigate()
  const [inviteEmail, setInviteEmail] = useState('')
  const [invited, setInvited] = useState(false)
  const [products, setProducts] = useState([])
  const [videos, setVideos] = useState([])
  const [currentVideo, setCurrentVideo] = useState(0)
  const mobile = useMobile()
  const { lang, t } = useLanguage()

  useEffect(() => {
    getProducts({ brand: 'solo' }).then(r => setProducts(r.data)).catch(() => {})
    getVideos('solo').then(r => setVideos(r.data)).catch(() => {})
  }, [])
  const { get } = useContent()

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
      <section style={{ paddingTop: mobile ? 80 : 100, minHeight: '100vh', position: 'relative', zIndex: 1, overflow: 'hidden' }}>


        {/* Content grid */}
        <div style={{
          position: 'relative', zIndex: 2,
          display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          gap: 0, minHeight: `calc(100vh - ${mobile ? 80 : 100}px)`,
        }}>
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: mobile ? '40px 24px 32px' : '80px 64px 80px 80px' }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 24 }}>
            {get('solo.home.season', "AUTUMN / WINTER '26")}
          </div>
          <h1 style={{
            fontSize: 56, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300,
            lineHeight: 1.1, marginBottom: 28, color: '#FAF8F5'
          }}>
            {get('solo.home.headline', 'Crafted for those who wear their story.')}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.6)', fontFamily: 'DM Sans', lineHeight: 1.8, maxWidth: 420, marginBottom: 40 }}>
            {get('solo.home.subtext', 'Bespoke Fantasy')}
          </p>
          <div style={{ display: 'flex', gap: 16, marginBottom: 56 }}>
            <button
              onClick={() => navigate('/solo/collection')}
              style={{
                padding: '13px 32px', borderRadius: 2, border: 'none', cursor: 'pointer',
                background: '#C9A96E', color: '#1A1A1A',
                fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2
              }}>
              {get('solo.home.cta1', t('explore_collection'))}
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
              {get('solo.home.cta2', t('book_consultation'))}
            </button>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(201,169,110,0.15)', paddingTop: 32 }}>
            {[
              [get('solo.home.stat1_value','148'), get('solo.home.stat1_label','PIECES / YEAR')],
              [get('solo.home.stat2_value','11'), get('solo.home.stat2_label','MASTER TAILORS')],
              [`${get('solo.home.stat3_value','Est.')} ${get('solo.home.stat3_suffix','2018')}`, '']
            ].map(([num, label], i) => (
              <div key={num} style={{ flex: 1, paddingRight: 24, borderRight: i < 2 ? '1px solid rgba(201,169,110,0.12)' : 'none', paddingLeft: i > 0 ? 24 : 0 }}>
                <div style={{ fontSize: 28, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#C9A96E', marginBottom: 4 }}>{num}</div>
                {label && <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans' }}>{label.toUpperCase()}</div>}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: luxury mirror video */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: mobile ? '0 24px 40px' : '40px 60px 40px 20px' }}
        >
          {videos.length > 0 ? (
            <MirrorVideo
              video={videos[currentVideo % videos.length]}
              loop={videos.length === 1}
              onEnded={videos.length > 1 ? () => setCurrentVideo(c => (c + 1) % videos.length) : undefined}
              mobile={mobile}
            />
          ) : (
            <MirrorVideo
              video={{ id: 'placeholder', url: '' }}
              loop={false}
              mobile={mobile}
            />
          )}
        </motion.div>
        </div>{/* end content grid */}
      </section>

      {/* Story section */}
      <section style={{ padding: mobile ? '40px 24px' : '80px', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 32 : 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <TailorAnimation />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 20 }}>{get('solo.home.craft_label', 'THE CRAFT')}</div>
          <h2 style={{ fontSize: 40, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, marginBottom: 24, lineHeight: 1.2 }}>
            {get('solo.home.craft_headline', 'The quiet art of the made-to-measure.')}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.6)', fontFamily: 'DM Sans', lineHeight: 1.9, marginBottom: 20 }}>
            {get('solo.home.craft_body1', 'Every Solo Sarto piece begins with a measurement and ends with a story. Our eleven master tailors work exclusively by appointment, shaping each garment to the exact contour of who will wear it.')}
          </p>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.9 }}>
            {get('solo.home.craft_body2', 'We have never made two identical pieces. We never will.')}
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 24 }}>
            <button
              onClick={() => navigate('/solo/story')}
              style={{
                padding: '11px 28px', borderRadius: 2, border: '1px solid #C9A96E', cursor: 'pointer',
                background: 'transparent', color: '#C9A96E', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 1.5
              }}>
              {get('solo.home.cta3', t('our_story'))}
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── COLLECTION ── editorial photo grid */}
      <section style={{ padding: mobile ? '56px 20px 64px' : '96px 72px 104px', position: 'relative', zIndex: 1, background: '#1C1812' }}>
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: mobile ? 40 : 56 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
            <div style={{ width: 36, height: 1, background: '#C9A96E', opacity: 0.5 }} />
            <span style={{ fontSize: 10, letterSpacing: 4, color: '#C9A96E', fontFamily: 'DM Sans' }}>
              {get('solo.home.collection_label', "AUTUMN / WINTER '26")}
            </span>
            <div style={{ width: 36, height: 1, background: '#C9A96E', opacity: 0.5 }} />
          </div>
          <h2 style={{ fontSize: mobile ? 36 : 54, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.05 }}>
            {get('solo.home.collection_heading', 'New Arrivals')}
          </h2>
        </motion.div>

        {/* Horizontal editorial slider */}
        {products.length > 0 ? (
          <EditorialSlider products={products} lang={lang} t={t} mobile={mobile} />
        ) : (
          /* Skeleton row while loading */
          <div style={{ display: 'flex', gap: mobile ? 12 : 20 }}>
            {Array(mobile ? 2 : 4).fill(null).map((_, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{
                  aspectRatio: '3/4', background: 'linear-gradient(145deg, #211C17, #1A1512)',
                  marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 22, color: 'rgba(201,169,110,0.08)' }}>SS</span>
                </div>
                <div style={{ height: 8, width: '40%', background: 'rgba(201,169,110,0.06)', marginBottom: 8 }} />
                <div style={{ height: 15, width: '70%', background: 'rgba(250,248,245,0.04)', marginBottom: 6 }} />
                <div style={{ height: 11, width: '28%', background: 'rgba(201,169,110,0.05)' }} />
              </div>
            ))}
          </div>
        )}

        {/* View all */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: 'center', marginTop: mobile ? 40 : 56 }}
        >
          <button
            onClick={() => navigate('/solo/collection')}
            style={{
              padding: '12px 40px',
              border: '1px solid rgba(201,169,110,0.35)',
              cursor: 'pointer', background: 'transparent', color: '#C9A96E',
              fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 3,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,169,110,0.08)'; e.currentTarget.style.borderColor = '#C9A96E' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)' }}
          >
            VIEW ALL PIECES →
          </button>
        </motion.div>
      </section>

      {/* Footer band */}
      <section style={{ background: '#FAF8F5', padding: '64px 80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(26,26,26,0.4)', fontFamily: 'DM Sans', marginBottom: 16 }}>
          {get('solo.home.circle_label', 'THE PRIVATE CIRCLE')}
        </div>
        <h3 style={{ fontSize: 32, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#1A1A1A', marginBottom: 8 }}>
          {get('solo.home.circle_sub', 'For an invitation to the next private viewing.')}
        </h3>
        <p style={{ fontSize: 14, color: 'rgba(26,26,26,0.55)', fontFamily: 'DM Sans', marginBottom: 32 }}>
          {get('solo.home.circle_note', 'By invitation only. Three showings per season.')}
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
              {t('request_invitation')}
            </button>
          </form>
        )}
      </section>
      <SoloFooter />
    </div>
  )
}
