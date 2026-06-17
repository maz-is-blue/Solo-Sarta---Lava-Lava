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

/* ── Luxury oval mirror ── */
function MirrorVideo({ video, loop, onEnded, mobile }) {
  // Fixed design space — SVG viewBox handles scaling
  const CX = 210, CY = 320, RX = 122, RY = 188
  const SW = 420, SH = 640

  const renderW = mobile ? 300 : 400
  const sc = renderW / SW
  const renderH = SH * sc

  // Video clip positions in rendered pixels
  const vx = (CX - RX) * sc, vy = (CY - RY) * sc
  const vw = RX * 2 * sc,    vh = RY * 2 * sc

  const goldFt  = 'rgba(201,169,110,0.6)'
  const goldDim = 'rgba(201,169,110,0.35)'

  const draw = (delay, dur = 0.85) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { pathLength: { duration: dur, ease: 'easeInOut', delay }, opacity: { duration: 0.3, delay } },
  })

  // Beaded pearl ring — precise, evenly spaced beads (the hallmark of a fine frame)
  const BEADS = 84
  const beadR_x = RX - 9, beadR_y = RY - 9
  const beads = Array.from({ length: BEADS }, (_, i) => {
    const a = (i / BEADS) * Math.PI * 2 - Math.PI / 2
    return { x: CX + beadR_x * Math.cos(a), y: CY + beadR_y * Math.sin(a) }
  })
  const beadTraceStart = 1.0, beadTraceDur = 1.8

  // Orbiting light path (rendered px) for the travelling highlight
  const orx = (RX + 6) * sc, ory = (RY + 6) * sc
  const ocx = CX * sc, ocy = CY * sc
  const orbitPath = `M ${ocx - orx},${ocy} a ${orx},${ory} 0 1,1 ${orx * 2},0 a ${orx},${ory} 0 1,1 ${-orx * 2},0`

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

      {/* Travelling light — a luminous bead orbiting the frame (the "hollow light") */}
      {[0, 0.5].map((phase, i) => (
        <motion.div key={i}
          initial={{ offsetDistance: `${phase * 100}%`, opacity: 0 }}
          animate={{ offsetDistance: `${phase * 100 + 100}%`, opacity: [0, 0.9, 0.9, 0] }}
          transition={{
            offsetDistance: { duration: 7, repeat: Infinity, ease: 'linear', delay: 2.4 },
            opacity: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2.4, times: [0, 0.1, 0.9, 1] },
          }}
          style={{
            position: 'absolute', left: 0, top: 0,
            width: 16, height: 16, marginLeft: -8, marginTop: -8,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,244,214,0.95) 0%, rgba(201,169,110,0.5) 40%, transparent 70%)',
            filter: 'blur(2px)', pointerEvents: 'none', zIndex: 4,
            offsetPath: `path('${orbitPath}')`,
            offsetRotate: '0deg',
          }}
        />
      ))}

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

        <defs>
          <linearGradient id="mirrorGold" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#F4E4B8" />
            <stop offset="42%" stopColor="#C9A96E" />
            <stop offset="100%" stopColor="#8A6B3C" />
          </linearGradient>
          <radialGradient id="beadGold" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#FCF3D6" />
            <stop offset="50%" stopColor="#D8BA7C" />
            <stop offset="100%" stopColor="#9A7A45" />
          </radialGradient>
        </defs>

        {/* === OVAL BORDER === */}
        {/* Outer hollow-light corona — thick blurred, draws then pulses */}
        <motion.ellipse cx={CX} cy={CY} rx={RX + 13} ry={RY + 13}
          fill="none" stroke="rgba(201,169,110,0.3)" strokeWidth={20}
          style={{ filter: 'blur(13px)' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: [null, 0.5, 1, 0.5] }}
          transition={{ pathLength: { duration: 2, delay: 0, ease: 'easeOut' }, opacity: { duration: 4, repeat: Infinity, delay: 2.3, ease: 'easeInOut' } }}
        />
        {/* Secondary softer glow */}
        <motion.ellipse cx={CX} cy={CY} rx={RX + 4} ry={RY + 4}
          fill="none" stroke="rgba(201,169,110,0.16)" strokeWidth={8}
          style={{ filter: 'blur(4px)' }}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 1.9, delay: 0.1, ease: 'easeOut' }}
        />
        {/* Main border — outer rim (thicker, metallic) */}
        <motion.ellipse cx={CX} cy={CY} rx={RX} ry={RY}
          fill="none" stroke="url(#mirrorGold)" strokeWidth={2.4}
          {...draw(0.15, 1.9)} animate={{ pathLength: 1, opacity: 0.9 }}
        />

        {/* === BEADED PEARL RING === */}
        {/* Sandwich rings around the beads */}
        <motion.ellipse cx={CX} cy={CY} rx={beadR_x + 5} ry={beadR_y + 5}
          fill="none" stroke={goldDim} strokeWidth={0.6}
          {...draw(0.55, 1.6)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        <motion.ellipse cx={CX} cy={CY} rx={beadR_x - 5} ry={beadR_y - 5}
          fill="none" stroke={goldDim} strokeWidth={0.6}
          {...draw(0.7, 1.6)} animate={{ pathLength: 1, opacity: 0.7 }}
        />
        {/* The pearls — each lights up in sequence, tracing the oval */}
        {beads.map((b, i) => (
          <motion.circle key={i} cx={b.x} cy={b.y} r={2.2}
            fill="url(#beadGold)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, delay: beadTraceStart + (i / BEADS) * beadTraceDur, ease: 'easeOut' }}
            style={{ transformOrigin: `${b.x}px ${b.y}px` }}
          />
        ))}
        {/* Innermost fine ring (mirror bezel edge) */}
        <motion.ellipse cx={CX} cy={CY} rx={RX - 16} ry={RY - 16}
          fill="none" stroke="url(#mirrorGold)" strokeWidth={0.9}
          {...draw(0.85, 1.7)} animate={{ pathLength: 1, opacity: 0.7 }}
        />

        {/* === TOP CREST === */}
        {/* stem to cartouche */}
        <motion.path d="M 210,132 L 210,120" fill="none" stroke={goldFt} strokeWidth={1} {...draw(1.7, 0.22)} />
        {/* cartouche */}
        <motion.ellipse cx={210} cy={104} rx={12} ry={14}
          fill="rgba(201,169,110,0.05)" stroke="url(#mirrorGold)" strokeWidth={1}
          {...draw(1.85, 0.45)} animate={{ pathLength: 1, opacity: 0.82 }}
        />
        <motion.ellipse cx={210} cy={104} rx={6} ry={7.5}
          fill="none" stroke={goldDim} strokeWidth={0.55}
          {...draw(2.05, 0.35)} animate={{ pathLength: 1, opacity: 0.6 }}
        />
        {/* palmette fan finial */}
        <motion.path d="M 190,88 Q 210,97 230,88" fill="none" stroke="url(#mirrorGold)" strokeWidth={0.9}
          {...draw(1.95, 0.4)} animate={{ pathLength: 1, opacity: 0.78 }} />
        {[
          'M 210,55 C 210,68 210,80 210,90',
          'M 210,55 C 202,66 198,78 199,90',
          'M 210,55 C 218,66 222,78 221,90',
          'M 210,56 C 196,65 189,77 191,88',
          'M 210,56 C 224,65 231,77 229,88',
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="url(#mirrorGold)" strokeWidth={0.85}
            {...draw(2.1 + i * 0.05, 0.4)} animate={{ pathLength: 1, opacity: 0.7 }} />
        ))}
        {/* finial tip */}
        <motion.path d="M 210,55 C 206,49 206,43 210,39 C 214,43 214,49 210,55"
          fill="rgba(201,169,110,0.08)" stroke="url(#mirrorGold)" strokeWidth={0.8}
          {...draw(2.35, 0.35)} animate={{ pathLength: 1, opacity: 0.7 }} />

        {/* graceful C-scrolls from cartouche sides */}
        <motion.path d="M 198,104 C 174,98 150,86 150,66 C 150,52 168,52 170,66 C 171,76 162,78 158,72"
          fill="none" stroke="url(#mirrorGold)" strokeWidth={1.05}
          {...draw(2.1, 0.85)} animate={{ pathLength: 1, opacity: 0.78 }} />
        <motion.path d="M 222,104 C 246,98 270,86 270,66 C 270,52 252,52 250,66 C 249,76 258,78 262,72"
          fill="none" stroke="url(#mirrorGold)" strokeWidth={1.05}
          {...draw(2.1, 0.85)} animate={{ pathLength: 1, opacity: 0.78 }} />
        {/* small leaf accents under scrolls */}
        <motion.path d="M 170,92 C 156,92 148,102 153,112 C 158,120 168,114 168,106"
          fill="none" stroke={goldDim} strokeWidth={0.75}
          {...draw(2.55, 0.4)} animate={{ pathLength: 1, opacity: 0.6 }} />
        <motion.path d="M 250,92 C 264,92 272,102 267,112 C 262,120 252,114 252,106"
          fill="none" stroke={goldDim} strokeWidth={0.75}
          {...draw(2.55, 0.4)} animate={{ pathLength: 1, opacity: 0.6 }} />

        {/* === SIDE SCROLLS === */}
        {[
          'M 90,300 C 72,292 60,272 70,256 C 78,244 92,250 88,264 C 85,274 74,272 72,264',
          'M 90,340 C 72,348 60,368 70,384 C 78,396 92,390 88,376 C 85,366 74,368 72,376',
          'M 330,300 C 348,292 360,272 350,256 C 342,244 328,250 332,264 C 335,274 346,272 348,264',
          'M 330,340 C 348,348 360,368 350,384 C 342,396 328,390 332,376 C 335,366 346,368 348,376',
        ].map((d, i) => (
          <motion.path key={i} d={d} fill="none" stroke="url(#mirrorGold)" strokeWidth={0.9}
            {...draw(2.4 + (i % 2) * 0.1, 0.7)} animate={{ pathLength: 1, opacity: 0.68 }} />
        ))}

        {/* === BOTTOM === */}
        {/* stem + medallion */}
        <motion.path d="M 210,508 L 210,524" fill="none" stroke={goldFt} strokeWidth={1} {...draw(2.6, 0.22)} />
        <motion.ellipse cx={210} cy={542} rx={14} ry={14}
          fill="rgba(201,169,110,0.05)" stroke="url(#mirrorGold)" strokeWidth={1}
          {...draw(2.75, 0.45)} animate={{ pathLength: 1, opacity: 0.8 }} />
        <motion.ellipse cx={210} cy={542} rx={7} ry={7}
          fill="none" stroke={goldDim} strokeWidth={0.55}
          {...draw(2.95, 0.35)} animate={{ pathLength: 1, opacity: 0.6 }} />
        {/* flanking scrolls */}
        <motion.path d="M 196,538 C 174,534 154,544 158,564 C 161,578 178,576 176,562"
          fill="none" stroke="url(#mirrorGold)" strokeWidth={0.95}
          {...draw(2.8, 0.75)} animate={{ pathLength: 1, opacity: 0.72 }} />
        <motion.path d="M 224,538 C 246,534 266,544 262,564 C 259,578 242,576 244,562"
          fill="none" stroke="url(#mirrorGold)" strokeWidth={0.95}
          {...draw(2.8, 0.75)} animate={{ pathLength: 1, opacity: 0.72 }} />
        {/* outer curls */}
        <motion.path d="M 158,564 C 142,566 132,578 138,590 C 143,599 154,594 154,584"
          fill="none" stroke={goldFt} strokeWidth={0.8}
          {...draw(3.1, 0.45)} animate={{ pathLength: 1, opacity: 0.62 }} />
        <motion.path d="M 262,564 C 278,566 288,578 282,590 C 277,599 266,594 266,584"
          fill="none" stroke={goldFt} strokeWidth={0.8}
          {...draw(3.1, 0.45)} animate={{ pathLength: 1, opacity: 0.62 }} />
        {/* pendant */}
        <motion.path d="M 210,556 L 210,568" fill="none" stroke={goldFt} strokeWidth={0.85} {...draw(3.2, 0.2)} />
        <motion.path d="M 210,568 C 202,578 199,594 210,604 C 221,594 218,578 210,568"
          fill="rgba(201,169,110,0.07)" stroke="url(#mirrorGold)" strokeWidth={0.9}
          {...draw(3.3, 0.45)} animate={{ pathLength: 1, opacity: 0.7 }} />
        <motion.path d="M 210,604 L 210,618" fill="none" stroke={goldDim} strokeWidth={0.7} {...draw(3.55, 0.18)} />
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
