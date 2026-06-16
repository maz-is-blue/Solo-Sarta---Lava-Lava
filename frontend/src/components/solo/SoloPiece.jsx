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
    <svg width="220" height="360" viewBox="0 0 120 200" style={{ overflow: 'visible' }}>
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
      <path d="M35,80 Q10,130 20,195 Q60,200 100,195 Q110,130 85,80" fill="none" stroke="#C9A96E" strokeWidth="0.8" opacity="0.4" />
      <path
        d="M45,20 Q42,12 60,8 Q78,12 75,20 L85,80 Q100,130 95,195 Q60,200 25,195 Q20,130 35,80 Z"
        fill="url(#pieceGrad)" opacity="0.85" filter="url(#pieceGlow)"
      />
      <line x1="52" y1="8" x2="48" y2="20" stroke="#C9A96E" strokeWidth="1.5" opacity="0.6" />
      <line x1="68" y1="8" x2="72" y2="20" stroke="#C9A96E" strokeWidth="1.5" opacity="0.6" />
      <path d="M38,78 Q60,86 82,78" fill="none" stroke="#C9A96E" strokeWidth="0.9" opacity="0.5" />
      <path d="M28,140 Q60,148 92,140" fill="none" stroke="#C9A96E" strokeWidth="0.6" opacity="0.25" />
      {[38, 72, 54, 84, 26].map((x, i) => (
        <circle key={i} cx={x} cy={50 + i * 28} r={1.2} fill="#C9A96E" opacity={0.5}
          style={{ animation: `sparkle ${1.8 + i * 0.3}s ${i * 0.4}s ease-in-out infinite` }}
        />
      ))}
    </svg>
  )
}

function Accordion({ label, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '15px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: '#FAF8F5',
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: 2.5, fontFamily: 'DM Sans' }}>{label}</span>
        <span style={{
          color: '#C9A96E', fontSize: 16, lineHeight: 1,
          display: 'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.22s ease',
        }}>›</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 18 }}>
          {children}
        </div>
      )}
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

  return (
    <div style={{ background: '#1C1812', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.025, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />
      <SoloNav />

      <div style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>

        {/* Breadcrumb */}
        <div style={{
          padding: mobile ? '14px 20px' : '14px 72px',
          display: 'flex', gap: 10, alignItems: 'center',
          borderBottom: '1px solid rgba(201,169,110,0.07)',
        }}>
          <span
            onClick={() => navigate('/solo/collection')}
            style={{ fontSize: 10, color: 'rgba(201,169,110,0.45)', fontFamily: 'DM Sans', letterSpacing: 1.5, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.45)'}
          >← COLLECTION</span>
          <span style={{ color: 'rgba(201,169,110,0.18)', fontSize: 9 }}>·</span>
          <span style={{ fontSize: 10, color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', letterSpacing: 1 }}>
            {displayName.toUpperCase()}
          </span>
        </div>

        {/* ── MAIN: image + info ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
          alignItems: 'start',
        }}>

          {/* LEFT: image — sticky on scroll */}
          <div style={{
            position: mobile ? 'relative' : 'sticky',
            top: 88,
            padding: mobile ? '24px 20px 0' : '40px 0 40px 72px',
          }}>
            {/* Main image */}
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              overflow: 'hidden',
              background: '#211C17',
              maxWidth: mobile ? '100%' : 500,
            }}>
              {displayImages[selectedImg] ? (
                <img
                  src={displayImages[selectedImg]}
                  alt={displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', width: 300, height: 300, top: '10%', left: '50%', transform: 'translateX(-50%)',
                    background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)', filter: 'blur(60px)',
                  }} />
                  <LargeSilhouette />
                </div>
              )}
              {product.code && (
                <div style={{
                  position: 'absolute', top: 14, left: 14,
                  fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans',
                  background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', padding: '4px 9px',
                }}>
                  {product.code}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {displayImages.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 10, maxWidth: mobile ? '100%' : 500, overflowX: 'auto' }}>
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(idx)}
                    style={{
                      flex: '0 0 auto', width: 64, height: 80,
                      padding: 0, border: 'none',
                      outline: selectedImg === idx ? '1.5px solid #C9A96E' : '1.5px solid transparent',
                      outlineOffset: 2,
                      overflow: 'hidden', background: '#211C17',
                      cursor: 'pointer', transition: 'outline-color 0.2s',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                  </button>
                ))}
              </div>
            )}

            <div style={{ marginTop: 14, fontSize: 9, letterSpacing: 3, color: 'rgba(201,169,110,0.22)', fontFamily: 'DM Sans' }}>
              AW/26 — SOLO SARTO ATELIER
            </div>
          </div>

          {/* RIGHT: product info */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ padding: mobile ? '32px 20px 48px' : '40px 72px 56px 52px' }}
          >
            {/* Category */}
            <div style={{ fontSize: 10, letterSpacing: 3.5, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 10, opacity: 0.8 }}>
              {product.cat?.toUpperCase()}
            </div>

            {/* Name */}
            <h1 style={{
              fontSize: mobile ? 34 : 46, fontFamily: 'Cormorant Garamond', fontStyle: 'italic',
              fontWeight: 300, lineHeight: 1.05, marginBottom: 14, color: '#FAF8F5',
            }}>
              {displayName}
            </h1>

            {/* Price */}
            <div style={{ fontSize: 22, color: '#C9A96E', fontFamily: 'Cormorant Garamond', marginBottom: 20, letterSpacing: 0.5 }}>
              {formatPrice(product.price, product.price_egp)}
            </div>

            {/* Description */}
            <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.9, marginBottom: 24, maxWidth: 430 }}>
              {(lang === 'ar' && product.product_desc_ar) ? product.product_desc_ar : product.product_desc}
            </p>

            {/* Palette swatches */}
            {palette.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 9 }}>PALETTE</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {palette.map((c, i) => (
                    <div key={i} style={{
                      width: 22, height: 22, borderRadius: '50%', background: c,
                      border: '1.5px solid rgba(201,169,110,0.25)',
                      boxShadow: '0 0 0 2px rgba(0,0,0,0.4)',
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 10 }}>SIZE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s === selectedSize ? null : s)} style={{
                      minWidth: 52, height: 40, padding: '0 12px',
                      border: `1px solid ${selectedSize === s ? '#C9A96E' : 'rgba(201,169,110,0.2)'}`,
                      background: selectedSize === s ? 'rgba(201,169,110,0.1)' : 'transparent',
                      color: selectedSize === s ? '#C9A96E' : 'rgba(250,248,245,0.4)',
                      fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', letterSpacing: 1,
                      transition: 'all 0.2s ease',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 20px', marginBottom: 28, fontSize: 11, color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans' }}>
              {product.cat && <span>Collection: <span style={{ color: 'rgba(250,248,245,0.55)' }}>{product.cat}</span></span>}
              {product.silhouette && <span>Silhouette: <span style={{ color: 'rgba(250,248,245,0.55)' }}>{product.silhouette}</span></span>}
              {product.code && <span>Article: <span style={{ color: 'rgba(250,248,245,0.55)' }}>{product.code}</span></span>}
            </div>

            {/* CTAs — stacked full width */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <button
                onClick={() => navigate('/solo/contact')}
                style={{
                  width: '100%', padding: '15px',
                  border: 'none', cursor: 'pointer',
                  background: '#C9A96E', color: '#1A1A1A',
                  fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 3,
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
                  width: '100%', padding: '15px',
                  cursor: 'pointer',
                  border: '1px solid rgba(201,169,110,0.3)',
                  background: added ? 'rgba(201,169,110,0.08)' : 'transparent',
                  color: added ? '#C9A96E' : 'rgba(250,248,245,0.55)',
                  fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 3,
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => { if (!added) { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E' } }}
                onMouseLeave={e => { if (!added) { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.3)'; e.currentTarget.style.color = 'rgba(250,248,245,0.55)' } }}
              >
                {added ? `✓ ${t('added_to_bag') || 'ADDED TO BAG'}` : t('add_to_bag_btn') || 'ADD TO BAG'}
              </button>
            </div>

            <p style={{ fontSize: 11, color: 'rgba(250,248,245,0.2)', fontFamily: 'DM Sans', lineHeight: 1.65, marginBottom: 28 }}>
              Prices are indicative. Final cost confirmed after consultation.<br />
              All pieces are non-returnable — made only for you.
            </p>

            {/* Accordion sections */}
            <Accordion label="FEATURES OF THE PIECE">
              <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>
                {product.product_desc || 'Bespoke, hand-crafted in our Cairo atelier. Each detail is considered, each seam finished by hand.'}
              </p>
            </Accordion>

            <Accordion label="DETAILS & DIMENSIONS">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
                {[
                  [t('fabric_label') || 'FABRIC', product.fabric],
                  [t('process_label') || 'LEAD TIME', product.process_time],
                  ['METHOD', 'Fully bespoke'],
                  ['FITTINGS', 'Minimum two sessions'],
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

            <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }} />
          </motion.div>
        </section>

        {/* ── YOU MAY ALSO LIKE ── */}
        {otherPieces.length > 0 && (
          <section style={{ padding: mobile ? '40px 20px 56px' : '56px 72px 80px', borderTop: '1px solid rgba(201,169,110,0.07)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 8 }}>FROM THE ATELIER</div>
                <h3 style={{ fontSize: mobile ? 28 : 36, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300 }}>
                  You May Also Like
                </h3>
              </div>
              <button
                onClick={() => navigate('/solo/collection')}
                style={{
                  background: 'none', border: 'none', color: 'rgba(201,169,110,0.4)', cursor: 'pointer',
                  fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 2, display: mobile ? 'none' : 'block',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.4)'}
              >
                VIEW ALL →
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: mobile ? '1fr 1fr' : `repeat(${Math.min(otherPieces.length, 4)}, 1fr)`,
              gap: mobile ? '20px 12px' : 24,
            }}>
              {otherPieces.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  onClick={() => { navigate(`/solo/piece/${p.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#211C17', marginBottom: 14 }}>
                    {p.image_url ? (
                      <img
                        src={p.image_url} alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', transition: 'transform 0.65s ease' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 20, color: 'rgba(201,169,110,0.1)' }}>SS</span>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 4 }}>
                    {p.cat?.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 17, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 4, lineHeight: 1.2 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#C9A96E', fontFamily: 'DM Sans' }}>
                    {formatPrice(p.price, p.price_egp)}
                  </div>
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
