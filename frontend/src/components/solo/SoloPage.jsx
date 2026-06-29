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

/* ── Luxury oval mirror for the hero video ── */
function MirrorVideo({ video, loop, onEnded, mobile }) {
  // Dimensions
  const MX = mobile ? 208 : 312   // mirror oval width
  const MY = mobile ? 336 : 500   // mirror oval height
  const RX = MX / 2               // horizontal radius
  const RY = MY / 2               // vertical radius
  const TOP = 96                  // room for crown above
  const SIDE = mobile ? 44 : 56   // room for glow on sides
  const BOT = 90                  // room for pendant below
  const SW = MX + SIDE * 2        // SVG total width
  const SH = MY + TOP + BOT       // SVG total height
  const CX = SW / 2               // ellipse center X
  const CY = TOP + RY             // ellipse center Y

  return (
    <div style={{ position: 'relative', width: SW, maxWidth: '100%' }}>

      {/* Breathing corona glow — behind everything */}
      <motion.div
        animate={{ opacity: [0.45, 0.9, 0.45], scale: [1, 1.03, 1] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          left: SIDE - 20, top: TOP - 20,
          width: MX + 40, height: MY + 40,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.18) 30%, transparent 75%)',
          filter: 'blur(28px)',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />

      {/* Video / placeholder clipped to oval via CSS clip-path */}
      <div style={{
        position: 'absolute',
        left: SIDE, top: TOP,
        width: MX, height: MY,
        clipPath: `ellipse(${RX}px ${RY}px at 50% 50%)`,
        overflow: 'hidden',
        background: '#1C1812',
      }}>
        {video.url ? (
          <video
            key={video.id}
            autoPlay muted playsInline
            loop={loop}
            onEnded={onEnded}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            src={video.url}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at 50% 40%, #2A2218 0%, #131009 100%)' }}>
            <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 52, color: 'rgba(201,169,110,0.1)', letterSpacing: 6 }}>SS</span>
          </div>
        )}
        {/* Mirror inner vignette — darkens edges of the oval */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(15,12,9,0.6) 100%)',
        }} />
      </div>

      {/* SVG frame — animated draw-in + crown + pendant */}
      <svg
        width={SW} height={SH}
        viewBox={`0 0 ${SW} ${SH}`}
        style={{ position: 'relative', display: 'block', pointerEvents: 'none', overflow: 'visible' }}
      >
        {/* Outer hollow-light glow ring — thick blurred stroke, pulses after draw */}
        <motion.ellipse
          cx={CX} cy={CY} rx={RX + 10} ry={RY + 10}
          fill="none" stroke="rgba(201,169,110,0.28)" strokeWidth={18}
          style={{ filter: 'blur(10px)' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1, opacity: [null, 0.55, 0.9, 0.55] }}
          transition={{
            pathLength: { duration: 2.2, ease: 'easeOut', delay: 0 },
            opacity:    { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2.2 },
          }}
        />

        {/* Secondary glow ring — slightly smaller, brighter */}
        <motion.ellipse
          cx={CX} cy={CY} rx={RX + 3} ry={RY + 3}
          fill="none" stroke="rgba(201,169,110,0.22)" strokeWidth={8}
          style={{ filter: 'blur(4px)' }}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.15 }}
        />

        {/* Main border — crisp thin gold oval, draws clockwise */}
        <motion.ellipse
          cx={CX} cy={CY} rx={RX} ry={RY}
          fill="none" stroke="#C9A96E" strokeWidth={1.1}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.75 }}
          transition={{ duration: 2, ease: 'easeOut', delay: 0.2 }}
        />

        {/* Inner fine ring — draws after main border */}
        <motion.ellipse
          cx={CX} cy={CY} rx={RX - 7} ry={RY - 7}
          fill="none" stroke="rgba(201,169,110,0.22)" strokeWidth={0.6}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, ease: 'easeOut', delay: 0.45 }}
        />

        {/* ── Crown ornament (top) ── */}
        {(() => {
          const topY = CY - RY            // oval apex
          return (
            <>
              {/* Stem from oval to crossbar */}
              <motion.line
                x1={CX} y1={topY - 1} x2={CX} y2={topY - 20}
                stroke="rgba(201,169,110,0.55)" strokeWidth={0.8}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 2.1 }}
              />
              {/* Horizontal cross-bar */}
              <motion.line
                x1={CX - 38} y1={topY - 24} x2={CX + 38} y2={topY - 24}
                stroke="rgba(201,169,110,0.45)" strokeWidth={0.8}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                style={{ transformOrigin: `${CX}px ${topY - 24}px` }}
                transition={{ duration: 0.5, delay: 2.25, ease: 'easeOut' }}
              />
              {/* Symmetric S-scroll curls off the cross-bar ends */}
              {[-1, 1].map(dir => (
                <motion.path key={dir}
                  d={`M ${CX + dir * 38} ${topY - 24}
                      C ${CX + dir * 54} ${topY - 24} ${CX + dir * 58} ${topY - 40} ${CX + dir * 46} ${topY - 44}
                      C ${CX + dir * 38} ${topY - 47} ${CX + dir * 37} ${topY - 38} ${CX + dir * 44} ${topY - 37}`}
                  fill="none" stroke="#C9A96E" strokeWidth={0.85}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.62 }}
                  transition={{ duration: 0.6, delay: 2.55 }}
                />
              ))}
              {/* Arms down from cross-bar ends */}
              {[-1, 1].map(dir => (
                <motion.line key={`arm${dir}`}
                  x1={CX + dir * 38} y1={topY - 24} x2={CX + dir * 38} y2={topY - 11}
                  stroke="rgba(201,169,110,0.35)" strokeWidth={0.7}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, delay: 2.5 }}
                />
              ))}
              {/* Center upward spire */}
              <motion.path
                d={`M ${CX} ${topY - 58} L ${CX - 9} ${topY - 24} L ${CX + 9} ${topY - 24} Z`}
                fill="rgba(201,169,110,0.08)" stroke="#C9A96E" strokeWidth={0.9} strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.7, scale: 1 }}
                style={{ transformOrigin: `${CX}px ${topY - 40}px` }}
                transition={{ duration: 0.45, delay: 2.35 }}
              />
              {/* Crowning dot above the spire */}
              <motion.circle
                cx={CX} cy={topY - 64} r={2.6}
                fill="rgba(201,169,110,0.18)" stroke="#C9A96E" strokeWidth={0.8}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.75, scale: 1 }}
                style={{ transformOrigin: `${CX}px ${topY - 64}px` }}
                transition={{ duration: 0.4, delay: 2.7 }}
              />
              {/* Mini diamonds flanking the spire base */}
              {[-1, 1].map(dir => {
                const dx = CX + dir * 19, dy = topY - 30
                return (
                  <motion.path key={`d${dir}`}
                    d={`M ${dx} ${dy - 6} L ${dx + 6} ${dy} L ${dx} ${dy + 6} L ${dx - 6} ${dy} Z`}
                    fill="rgba(201,169,110,0.1)" stroke="#C9A96E" strokeWidth={0.8}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.65 }}
                    transition={{ duration: 0.35, delay: 2.6 }}
                  />
                )
              })}
              {/* Outer-end diamonds on the scroll tips */}
              {[-1, 1].map(dir => {
                const dx = CX + dir * 46, dy = topY - 44
                return (
                  <motion.path key={`dt${dir}`}
                    d={`M ${dx} ${dy - 4} L ${dx + 4} ${dy} L ${dx} ${dy + 4} L ${dx - 4} ${dy} Z`}
                    fill="rgba(201,169,110,0.1)" stroke="#C9A96E" strokeWidth={0.7}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
                    transition={{ duration: 0.35, delay: 2.85 }}
                  />
                )
              })}
            </>
          )
        })()}

        {/* ── Pendant ornament (bottom) ── */}
        {(() => {
          const botY = CY + RY            // oval base
          return (
            <>
              {/* Stem to the cluster */}
              <motion.line
                x1={CX} y1={botY + 1} x2={CX} y2={botY + 14}
                stroke="rgba(201,169,110,0.45)" strokeWidth={0.8}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 2.1 }}
              />
              {/* Symmetric scroll curls sweeping outward then down */}
              {[-1, 1].map(dir => (
                <motion.path key={dir}
                  d={`M ${CX} ${botY + 14}
                      C ${CX + dir * 20} ${botY + 14} ${CX + dir * 30} ${botY + 26} ${CX + dir * 24} ${botY + 38}
                      C ${CX + dir * 19} ${botY + 47} ${CX + dir * 9} ${botY + 42} ${CX + dir * 12} ${botY + 33}`}
                  fill="none" stroke="#C9A96E" strokeWidth={0.85}
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.6, delay: 2.45 }}
                />
              ))}
              {/* Central teardrop pendant */}
              <motion.path
                d={`M ${CX} ${botY + 14} L ${CX - 8} ${botY + 26} L ${CX} ${botY + 40} L ${CX + 8} ${botY + 26} Z`}
                fill="rgba(201,169,110,0.08)" stroke="#C9A96E" strokeWidth={0.9} strokeLinejoin="round"
                initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 0.62, scale: 1 }}
                style={{ transformOrigin: `${CX}px ${botY + 27}px` }}
                transition={{ duration: 0.4, delay: 2.4 }}
              />
              {/* Small drop beneath the teardrop */}
              <motion.line
                x1={CX} y1={botY + 40} x2={CX} y2={botY + 52}
                stroke="rgba(201,169,110,0.4)" strokeWidth={0.7}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: 2.7 }}
              />
              <motion.circle
                cx={CX} cy={botY + 57} r={3}
                fill="rgba(201,169,110,0.14)" stroke="#C9A96E" strokeWidth={0.8}
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }}
                style={{ transformOrigin: `${CX}px ${botY + 57}px` }}
                transition={{ duration: 0.4, delay: 2.8 }}
              />
              {/* Diamond finials on the scroll tips */}
              {[-1, 1].map(dir => {
                const dx = CX + dir * 24, dy = botY + 38
                return (
                  <motion.path key={`pd${dir}`}
                    d={`M ${dx} ${dy - 4} L ${dx + 4} ${dy} L ${dx} ${dy + 4} L ${dx - 4} ${dy} Z`}
                    fill="rgba(201,169,110,0.1)" stroke="#C9A96E" strokeWidth={0.7}
                    initial={{ opacity: 0 }} animate={{ opacity: 0.55 }}
                    transition={{ duration: 0.35, delay: 2.75 }}
                  />
                )
              })}
            </>
          )
        })()}
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
          style={{ display: 'flex', alignItems: mobile ? 'center' : 'flex-start', justifyContent: 'center', padding: mobile ? '0 24px 40px' : '12px 60px 24px 20px' }}
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
