import { useParams, useNavigate } from 'react-router-dom'
import { formatPrice } from '../../utils/price'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import SoloNav from './SoloNav'
import SoloFooter from './SoloFooter'
import { getProduct, getProducts } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useMobile } from '../../hooks/useMobile'
import { useLanguage } from '../../context/LanguageContext'

const GRAIN = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'

function LargeSilhouette() {
  return (
    <svg width="180" height="300" viewBox="0 0 120 200" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="pieceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#E8D5A3" stopOpacity="0.45" />
        </linearGradient>
        <filter id="pieceGlow">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M45,20 Q42,12 60,8 Q78,12 75,20 L85,80 Q60,90 35,80 Z" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.4" />
      <path
        d="M45,20 Q42,12 60,8 Q78,12 75,20 L85,80 Q100,130 95,195 Q60,200 25,195 Q20,130 35,80 Z"
        fill="url(#pieceGrad)" opacity="0.85" filter="url(#pieceGlow)"
      />
      {[38, 72, 54, 84, 26].map((x, i) => (
        <circle key={i} cx={x} cy={50 + i * 28} r={1.2} fill="#C9A96E" opacity={0.5}
          style={{ animation: `sparkle ${1.8 + i * 0.3}s ${i * 0.4}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  )
}

function Accordion({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '13px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: '#FAF8F5',
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: 2.5, fontFamily: 'DM Sans' }}>{label}</span>
        <span style={{
          color: '#C9A96E', fontSize: 15, lineHeight: 1,
          display: 'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.22s ease',
        }}>›</span>
      </button>
      {open && <div style={{ paddingBottom: 16 }}>{children}</div>}
    </div>
  )
}

/* Elegant photo frame — lines + L-bracket corners */
function PhotoFrame({ children, name }) {
  const OFF = 10   // px outside the photo
  const ARM = 22   // corner bracket arm length

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>

      {/* Vertical label — left */}
      <div style={{
        position: 'absolute', left: -(OFF + 24), top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        fontSize: 7.5, letterSpacing: 4, fontFamily: 'DM Sans', fontWeight: 500,
        color: 'rgba(201,169,110,0.32)', whiteSpace: 'nowrap', userSelect: 'none', zIndex: 4,
      }}>SOLO · SARTO · BESPOKE ATELIER</div>

      {/* Vertical label — right */}
      <div style={{
        position: 'absolute', right: -(OFF + 20), top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        fontSize: 7.5, letterSpacing: 4, fontFamily: 'DM Sans',
        color: 'rgba(201,169,110,0.2)', whiteSpace: 'nowrap', userSelect: 'none', zIndex: 4,
      }}>AW · 26 · COLLECTION</div>

      {/* Frame overlay — corners only */}
      <div style={{ position: 'absolute', inset: -OFF, zIndex: 3, pointerEvents: 'none' }}>

        {/* Corner L-brackets — TL */}
        <svg width={ARM + 1} height={ARM + 1} viewBox={`0 0 ${ARM + 1} ${ARM + 1}`}
          style={{ position: 'absolute', top: -0.5, left: -0.5 }}>
          <path d={`M${ARM},0.5 L0.5,0.5 L0.5,${ARM}`} fill="none" stroke="#C9A96E" strokeWidth="1.3" opacity="0.75" />
        </svg>
        {/* TR */}
        <svg width={ARM + 1} height={ARM + 1} viewBox={`0 0 ${ARM + 1} ${ARM + 1}`}
          style={{ position: 'absolute', top: -0.5, right: -0.5 }}>
          <path d={`M0.5,0.5 L${ARM},0.5 L${ARM},${ARM}`} fill="none" stroke="#C9A96E" strokeWidth="1.3" opacity="0.75" />
        </svg>
        {/* BL */}
        <svg width={ARM + 1} height={ARM + 1} viewBox={`0 0 ${ARM + 1} ${ARM + 1}`}
          style={{ position: 'absolute', bottom: -0.5, left: -0.5 }}>
          <path d={`M0.5,0.5 L0.5,${ARM} L${ARM},${ARM}`} fill="none" stroke="#C9A96E" strokeWidth="1.3" opacity="0.75" />
        </svg>
        {/* BR */}
        <svg width={ARM + 1} height={ARM + 1} viewBox={`0 0 ${ARM + 1} ${ARM + 1}`}
          style={{ position: 'absolute', bottom: -0.5, right: -0.5 }}>
          <path d={`M0.5,${ARM} L${ARM},${ARM} L${ARM},0.5`} fill="none" stroke="#C9A96E" strokeWidth="1.3" opacity="0.75" />
        </svg>
      </div>

      {/* Atmospheric glow behind photo */}
      <div style={{
        position: 'absolute', inset: -30, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 45%, rgba(201,169,110,0.09) 0%, transparent 65%)',
        filter: 'blur(20px)',
      }} />

      {/* Photo content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}

export default function SoloPiece() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedImg, setSelectedImg] = useState(0)
  const [product, setProduct] = useState(null)
  const [otherPieces, setOtherPieces] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)
  const mobile = useMobile()
  const { lang, t } = useLanguage()

  useEffect(() => {
    setLoadingProduct(true)
    getProduct(slug)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoadingProduct(false))
    getProducts({ brand: 'solo' })
      .then(r => setOtherPieces(r.data.filter(p => p.slug !== slug).slice(0, 4)))
      .catch(() => {})
  }, [slug])

  const displayImages = useMemo(() => {
    if (!product) return []
    const si = product.size_images || {}
    if (selectedSize && si[selectedSize]?.length) return si[selectedSize]
    if (product.images?.length) return product.images
    if (product.image_url) return [product.image_url]
    return []
  }, [selectedSize, product])

  useEffect(() => { setSelectedImg(0) }, [selectedSize])

  if (loadingProduct) {
    return (
      <div style={{ background: '#1C1812', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SoloNav />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ background: '#1C1812', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <SoloNav />
        <p style={{ color: 'rgba(250,248,245,0.5)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 22 }}>This piece has moved on.</p>
        <button onClick={() => navigate('/solo/collection')} style={{ background: 'none', border: '1px solid rgba(201,169,110,0.4)', color: '#C9A96E', padding: '10px 24px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2 }}>
          ← COLLECTION
        </button>
      </div>
    )
  }

  const displayName = (lang === 'ar' && product.name_ar) ? product.name_ar : product.name
  const palette = Array.isArray(product.palette)
    ? product.palette
    : (() => { try { return JSON.parse(product.palette || '[]') } catch { return [] } })()

  /* ── MOBILE layout ─────────────────────────────────────────── */
  if (mobile) {
    return (
      <div style={{ background: '#1C1812', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
        <div style={{ position: 'fixed', inset: 0, opacity: 0.025, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />
        <SoloNav />
        <div style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(201,169,110,0.07)', fontSize: 10, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', letterSpacing: 1.5 }}>
            <span onClick={() => navigate('/solo/collection')} style={{ cursor: 'pointer' }}>← COLLECTION</span>
            <span style={{ margin: '0 8px', opacity: 0.4 }}>·</span>
            <span style={{ color: 'rgba(250,248,245,0.3)' }}>{displayName.toUpperCase()}</span>
          </div>

          {/* Mobile: photo */}
          <div style={{ padding: '32px 32px 24px' }}>
            <PhotoFrame name={displayName}>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#211C17' }}>
                {displayImages[selectedImg]
                  ? <img src={displayImages[selectedImg]} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><LargeSilhouette /></div>
                }
              </div>
            </PhotoFrame>
            {displayImages.length > 1 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 16, justifyContent: 'center', alignItems: 'center' }}>
                {displayImages.map((_, idx) => (
                  <button key={idx} onClick={() => setSelectedImg(idx)} style={{
                    width: selectedImg === idx ? 28 : 13,
                    height: 2, padding: 0, border: 'none', borderRadius: 1,
                    background: selectedImg === idx ? '#C9A96E' : 'rgba(201,169,110,0.25)',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Mobile: info + controls */}
          <div style={{ padding: '0 20px 48px' }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 8 }}>{product.cat?.toUpperCase()}</div>
            <h1 style={{ fontSize: 32, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>{displayName}</h1>
            <div style={{ fontSize: 20, color: '#C9A96E', fontFamily: 'Cormorant Garamond', marginBottom: 16 }}>{formatPrice(product.price, product.price_egp)}</div>
            <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.85, marginBottom: 20 }}>
              {(lang === 'ar' && product.product_desc_ar) ? product.product_desc_ar : product.product_desc}
            </p>
            {palette.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 8 }}>PALETTE</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {palette.map((c, i) => <div key={i} style={{ width: 20, height: 20, borderRadius: '50%', background: c, border: '1.5px solid rgba(201,169,110,0.25)', boxShadow: '0 0 0 2px rgba(0,0,0,0.4)' }} />)}
                </div>
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 10 }}>SIZE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s === selectedSize ? null : s)} style={{
                      minWidth: 52, height: 40, padding: '0 12px',
                      border: `1px solid ${selectedSize === s ? '#C9A96E' : 'rgba(201,169,110,0.22)'}`,
                      background: selectedSize === s ? 'rgba(201,169,110,0.1)' : 'transparent',
                      color: selectedSize === s ? '#C9A96E' : 'rgba(250,248,245,0.4)',
                      fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              <button onClick={() => navigate('/solo/contact')} style={{ width: '100%', padding: '14px', border: 'none', cursor: 'pointer', background: '#C9A96E', color: '#1A1A1A', fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 3 }}>
                {t('request_fitting') || 'APPOINTMENT FOR FITTING'}
              </button>
              <button onClick={() => { addItem('solo', product, selectedSize || 'Bespoke'); setAdded(true); setTimeout(() => setAdded(false), 2500) }}
                style={{ width: '100%', padding: '14px', cursor: 'pointer', border: '1px solid rgba(201,169,110,0.3)', background: added ? 'rgba(201,169,110,0.08)' : 'transparent', color: added ? '#C9A96E' : 'rgba(250,248,245,0.55)', fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 3, transition: 'all 0.25s' }}>
                {added ? `✓ ${t('added_to_bag') || 'ADDED'}` : t('add_to_bag_btn') || 'ADD TO BAG'}
              </button>
            </div>
            <Accordion label="FEATURES OF THE PIECE"><p style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>{product.product_desc || 'Hand-crafted in our Cairo atelier.'}</p></Accordion>
            <Accordion label="DETAILS & DIMENSIONS">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px' }}>
                {[[t('fabric_label') || 'FABRIC', product.fabric],[t('process_label') || 'LEAD TIME', product.process_time],['METHOD','Fully bespoke'],['FITTINGS','Min. two sessions']].filter(([,v]) => v).map(([k,v]) => (
                  <div key={k}><div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(201,169,110,0.38)', fontFamily: 'DM Sans', marginBottom: 3 }}>{k}</div><div style={{ fontSize: 12, color: 'rgba(250,248,245,0.6)', fontFamily: 'DM Sans' }}>{v}</div></div>
                ))}
              </div>
            </Accordion>
            <Accordion label="THE ATELIER"><p style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>All Solo Sarto commissions are by appointment only. Forty-two measurements, hand-drafted pattern, minimum two fittings.</p></Accordion>
            <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }} />
          </div>
        </div>
        <SoloFooter />
      </div>
    )
  }

  /* ── DESKTOP: 3-column ─────────────────────────────────────── */
  return (
    <div style={{ background: '#1C1812', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.025, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />
      <SoloNav />

      <div style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>

        {/* Breadcrumb */}
        <div style={{ padding: '14px 48px', display: 'flex', gap: 10, alignItems: 'center', borderBottom: '1px solid rgba(201,169,110,0.07)' }}>
          <span onClick={() => navigate('/solo/collection')} style={{ fontSize: 10, color: 'rgba(201,169,110,0.45)', fontFamily: 'DM Sans', letterSpacing: 1.5, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.45)'}
          >← COLLECTION</span>
          <span style={{ color: 'rgba(201,169,110,0.18)', fontSize: 9 }}>·</span>
          <span style={{ fontSize: 10, color: 'rgba(250,248,245,0.28)', fontFamily: 'DM Sans', letterSpacing: 1 }}>{displayName.toUpperCase()}</span>
        </div>

        {/* ── 3-column grid ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.25fr 1fr',
          minHeight: 'calc(100vh - 140px)',
          alignItems: 'start',
        }}>

          {/* ── LEFT: name, price, description, accordions ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              borderRight: '1px solid rgba(201,169,110,0.08)',
              position: 'sticky', top: 88,
              maxHeight: 'calc(100vh - 88px)', overflowY: 'auto',
              padding: '48px 40px 48px 56px',
              scrollbarWidth: 'none',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: 3.5, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12, opacity: 0.8 }}>
              {product.cat?.toUpperCase()}
            </div>
            <h1 style={{ fontSize: 38, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.05, marginBottom: 14, color: '#FAF8F5' }}>
              {displayName}
            </h1>
            <div style={{ fontSize: 22, color: '#C9A96E', fontFamily: 'Cormorant Garamond', marginBottom: 22 }}>
              {formatPrice(product.price, product.price_egp)}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.52)', fontFamily: 'DM Sans', lineHeight: 1.9, marginBottom: 32 }}>
              {(lang === 'ar' && product.product_desc_ar) ? product.product_desc_ar : product.product_desc}
            </p>

            {/* Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32, fontSize: 11, fontFamily: 'DM Sans' }}>
              {product.cat && (
                <div><span style={{ color: 'rgba(201,169,110,0.4)' }}>Collection: </span><span style={{ color: 'rgba(250,248,245,0.55)' }}>{product.cat}</span></div>
              )}
              {product.silhouette && (
                <div><span style={{ color: 'rgba(201,169,110,0.4)' }}>Silhouette: </span><span style={{ color: 'rgba(250,248,245,0.55)' }}>{product.silhouette}</span></div>
              )}
              {product.code && (
                <div><span style={{ color: 'rgba(201,169,110,0.4)' }}>Article: </span><span style={{ color: 'rgba(250,248,245,0.55)' }}>{product.code}</span></div>
              )}
            </div>

            {/* Accordions */}
            <Accordion label="FEATURES OF THE PIECE">
              <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>
                {product.product_desc || 'Bespoke, hand-crafted in our Cairo atelier. Each detail is considered, each seam finished by hand.'}
              </p>
            </Accordion>
            <Accordion label="DETAILS & DIMENSIONS">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' }}>
                {[
                  [t('fabric_label') || 'FABRIC', product.fabric],
                  [t('process_label') || 'LEAD TIME', product.process_time],
                  ['METHOD', 'Fully bespoke'],
                  ['FITTINGS', 'Min. two sessions'],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(201,169,110,0.38)', fontFamily: 'DM Sans', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.6)', fontFamily: 'DM Sans' }}>{v}</div>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion label="THE ATELIER">
              <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>
                All Solo Sarto commissions are by appointment only. Our eleven master tailors take forty-two measurements across two sessions. Your piece is then hand-drafted and constructed over several weeks.
              </p>
            </Accordion>
            <p style={{ fontSize: 10.5, color: 'rgba(250,248,245,0.18)', fontFamily: 'DM Sans', lineHeight: 1.7, marginTop: 24 }}>
              Prices are indicative. Final cost confirmed after consultation. All pieces are non-returnable.
            </p>
          </motion.div>

          {/* ── CENTER: photo ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '56px 48px',
              borderRight: '1px solid rgba(201,169,110,0.08)',
            }}
          >
            <PhotoFrame name={displayName}>
              {/* Main image */}
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#211C17', width: '100%' }}>
                {displayImages[selectedImg] ? (
                  <img
                    src={displayImages[selectedImg]}
                    alt={displayName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', width: 280, height: 280, top: '5%', left: '50%', transform: 'translateX(-50%)', background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)', filter: 'blur(50px)' }} />
                    <LargeSilhouette />
                  </div>
                )}
              </div>
            </PhotoFrame>

            {/* Pill navigation */}
            {displayImages.length > 1 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    style={{
                      width: selectedImg === idx ? 30 : 14,
                      height: 2, padding: 0, border: 'none', borderRadius: 1,
                      background: selectedImg === idx ? '#C9A96E' : 'rgba(201,169,110,0.25)',
                      cursor: 'pointer', transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            )}

            <div style={{ marginTop: 14, fontSize: 9, letterSpacing: 3, color: 'rgba(201,169,110,0.2)', fontFamily: 'DM Sans' }}>
              AW/26 — SOLO SARTO ATELIER
            </div>
          </motion.div>

          {/* ── RIGHT: color, size, buttons ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'sticky', top: 88,
              maxHeight: 'calc(100vh - 88px)', overflowY: 'auto',
              padding: '48px 56px 48px 40px',
              scrollbarWidth: 'none',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}
          >
            {/* Palette */}
            {palette.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>COLOR</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {palette.map((c, i) => (
                    <div key={i} style={{
                      width: 26, height: 26, borderRadius: '50%', background: c,
                      border: '1.5px solid rgba(201,169,110,0.28)',
                      boxShadow: '0 0 0 2px rgba(0,0,0,0.45)',
                      cursor: 'default',
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>SIZE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s === selectedSize ? null : s)} style={{
                      minWidth: 56, height: 42, padding: '0 12px',
                      border: `1px solid ${selectedSize === s ? '#C9A96E' : 'rgba(201,169,110,0.22)'}`,
                      background: selectedSize === s ? 'rgba(201,169,110,0.1)' : 'transparent',
                      color: selectedSize === s ? '#C9A96E' : 'rgba(250,248,245,0.4)',
                      fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              <button
                onClick={() => navigate('/solo/contact')}
                style={{
                  width: '100%', padding: '14px 12px',
                  border: 'none', cursor: 'pointer',
                  background: '#C9A96E', color: '#1A1A1A',
                  fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 2.5,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#D4B47C'}
                onMouseLeave={e => e.currentTarget.style.background = '#C9A96E'}
              >
                {t('request_fitting') || 'APPOINTMENT FOR FITTING'}
              </button>

              <button
                onClick={() => { addItem('solo', product, selectedSize || 'Bespoke'); setAdded(true); setTimeout(() => setAdded(false), 2500) }}
                style={{
                  width: '100%', padding: '14px 12px',
                  cursor: 'pointer',
                  border: '1px solid rgba(201,169,110,0.3)',
                  background: added ? 'rgba(201,169,110,0.08)' : 'transparent',
                  color: added ? '#C9A96E' : 'rgba(250,248,245,0.5)',
                  fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 2.5,
                  transition: 'all 0.25s',
                }}
                onMouseEnter={e => { if (!added) { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E' } }}
                onMouseLeave={e => { if (!added) { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; e.currentTarget.style.color = 'rgba(250,248,245,0.5)' } }}
              >
                {added ? `✓ ${t('added_to_bag') || 'ADDED TO BAG'}` : `♡  ${t('add_to_bag_btn') || 'ADD TO BAG'}`}
              </button>
            </div>

            <p style={{ fontSize: 10.5, color: 'rgba(250,248,245,0.18)', fontFamily: 'DM Sans', lineHeight: 1.7 }}>
              Prices are indicative. Final cost confirmed after consultation.<br />
              All pieces are non-returnable — made only for you.
            </p>
          </motion.div>
        </section>

        {/* ── YOU MAY ALSO LIKE ── */}
        {otherPieces.length > 0 && (
          <section style={{ padding: '56px 72px 80px', borderTop: '1px solid rgba(201,169,110,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 8 }}>FROM THE ATELIER</div>
                <h3 style={{ fontSize: 36, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300 }}>You May Also Like</h3>
              </div>
              <button onClick={() => navigate('/solo/collection')}
                style={{ background: 'none', border: 'none', color: 'rgba(201,169,110,0.4)', cursor: 'pointer', fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 2 }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.4)'}
              >VIEW ALL →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(otherPieces.length, 4)}, 1fr)`, gap: 24 }}>
              {otherPieces.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  onClick={() => { navigate(`/solo/piece/${p.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#211C17', marginBottom: 14 }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', transition: 'transform 0.65s ease' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 20, color: 'rgba(201,169,110,0.1)' }}>SS</span>
                        </div>
                    }
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 4 }}>{p.cat?.toUpperCase()}</div>
                  <div style={{ fontSize: 17, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 4, lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#C9A96E', fontFamily: 'DM Sans' }}>{formatPrice(p.price, p.price_egp)}</div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <SoloFooter />
      </div>
    </div>
  )
}
