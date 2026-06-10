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

const PROCESS_STEPS = [
  { n: '01', title: 'Discovery', desc: 'We meet to understand your life, not just your measurements.' },
  { n: '02', title: 'Measurement', desc: 'Forty-two measurements taken across two sessions.' },
  { n: '03', title: 'Design', desc: 'A hand-drawn pattern is drafted exclusively for you.' },
  { n: '04', title: 'Creation', desc: 'Our master tailors begin cutting and stitching by hand.' },
  { n: '05', title: 'Fitting', desc: 'At least two fittings to refine every seam and drape.' },
  { n: '06', title: 'Delivery', desc: 'Your piece arrives in a hand-sewn cotton garment bag.' },
]

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
      .then(r => setOtherPieces(r.data.filter(p => p.slug !== slug).slice(0, 3)))
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
      <div style={{ background: '#2A2420', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SoloNav />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ background: '#2A2420', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <SoloNav />
        <p style={{ color: 'rgba(250,248,245,0.5)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 22 }}>This piece has moved on.</p>
        <button onClick={() => navigate('/solo/collection')} style={{ background: 'none', border: '1px solid rgba(201,169,110,0.4)', color: '#C9A96E', padding: '10px 24px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2 }}>
          ← COLLECTION
        </button>
      </div>
    )
  }

  return (
    <div style={{ background: '#2A2420', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />
      <SoloNav />

      <div style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <div style={{ padding: '20px 80px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span onClick={() => navigate('/solo/collection')} style={{ fontSize: 11, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', letterSpacing: 1.5, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.5)'}
          >COLLECTION</span>
          <span style={{ fontSize: 11, color: 'rgba(250,248,245,0.2)', fontFamily: 'DM Sans' }}>—</span>
          <span style={{ fontSize: 11, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans', letterSpacing: 1 }}>{product.name.toUpperCase()}</span>
        </div>

        {/* Hero — two column */}
        <section style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 0, padding: mobile ? '24px 24px 48px' : '32px 80px 80px', alignItems: 'start' }}>
          {/* Left — visual */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', paddingRight: 40 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #2E2822, #201C18)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 4, padding: '64px 48px',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              position: 'relative', overflow: 'hidden', width: '100%', maxWidth: 420
            }}>
              <div style={{
                position: 'absolute', width: 400, height: 400, top: '-20%', left: '50%', transform: 'translateX(-50%)',
                background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)',
                filter: 'blur(60px)', pointerEvents: 'none'
              }} />
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', marginBottom: displayImages.length ? 0 : 40 }}>{product.code}</div>
              {displayImages[selectedImg]
                ? <img src={displayImages[selectedImg]} alt={product.name} style={{ width: '100%', maxWidth: 320, borderRadius: 4, objectFit: 'cover', marginBottom: displayImages.length > 1 ? 12 : 24 }} />
                : <LargeSilhouette />
              }
              {displayImages.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
                  {displayImages.map((url, idx) => (
                    <button key={idx} onClick={() => setSelectedImg(idx)} style={{
                      width: 52, height: 52, borderRadius: 3, padding: 0, overflow: 'hidden',
                      border: `1px solid ${selectedImg === idx ? '#C9A96E' : 'rgba(201,169,110,0.15)'}`,
                      cursor: 'pointer', opacity: selectedImg === idx ? 1 : 0.55,
                      transition: 'all 0.2s',
                    }}>
                      <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 8, fontSize: 11, letterSpacing: 2, color: 'rgba(250,248,245,0.2)', fontFamily: 'DM Sans' }}>
                AW/26 — ATELIER
              </div>
            </div>
          </motion.div>

          {/* Right — details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{ paddingLeft: 40 }}
          >
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 16 }}>{product.cat.toUpperCase()}</div>
            <h1 style={{ fontSize: 48, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>
              {(lang === 'ar' && product.name_ar) ? product.name_ar : product.name}
            </h1>
            <div style={{ fontSize: 26, color: '#C9A96E', fontFamily: 'Cormorant Garamond', marginBottom: 32 }}>
              {formatPrice(product.price, product.price_egp)}
            </div>
            <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.65)', fontFamily: 'DM Sans', lineHeight: 1.9, marginBottom: 32, maxWidth: 440 }}>
              {(lang === 'ar' && product.product_desc_ar) ? product.product_desc_ar : product.product_desc}
            </p>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40, borderTop: '1px solid rgba(201,169,110,0.12)', paddingTop: 28 }}>
              {[
                [t('fabric_label'), product.fabric],
                [t('process_label'), product.process_time],
                [t('method_label'), 'Fully bespoke'],
                [t('atelier_label'), 'By appointment'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', marginBottom: 6 }}>{k.toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: 'rgba(250,248,245,0.7)', fontFamily: 'DM Sans' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Size selector */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>SIZE GUIDE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s === selectedSize ? null : s)} style={{
                      width: 52, height: 44, borderRadius: 3,
                      border: `1px solid ${selectedSize === s ? '#C9A96E' : 'rgba(201,169,110,0.2)'}`,
                      background: selectedSize === s ? 'rgba(201,169,110,0.12)' : 'transparent',
                      color: selectedSize === s ? '#C9A96E' : 'rgba(250,248,245,0.45)',
                      fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', letterSpacing: 1,
                      transition: 'all 0.2s ease',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/solo/contact')}
                style={{
                  padding: '14px 32px', borderRadius: 2, border: 'none', cursor: 'pointer',
                  background: '#C9A96E', color: '#1A1A1A',
                  fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2
                }}
              >
                {t('request_fitting')}
              </button>
              <button
                onClick={() => { addItem('solo', product, selectedSize || 'Bespoke'); setAdded(true); setTimeout(() => setAdded(false), 2500) }}
                style={{
                  padding: '14px 32px', borderRadius: 2, cursor: 'pointer',
                  border: '1px solid rgba(201,169,110,0.4)',
                  background: added ? 'rgba(201,169,110,0.1)' : 'transparent',
                  color: added ? '#C9A96E' : 'rgba(250,248,245,0.7)',
                  fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 2, transition: 'all 0.25s ease'
                }}
              >
                {added ? `✓ ${t('added_to_bag')}` : t('add_to_bag_btn')}
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans', marginTop: 20, lineHeight: 1.6 }}>
              Prices are indicative. Final cost confirmed after consultation.<br />
              All pieces are non-returnable — made only for you.
            </p>
          </motion.div>
        </section>

        {/* Process */}
        <section style={{ padding: mobile ? '40px 24px' : '64px 80px', borderTop: '1px solid rgba(201,169,110,0.1)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12 }}>THE PROCESS</div>
            <h2 style={{ fontSize: 38, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, marginBottom: 48 }}>
              From first meeting to final fitting.
            </h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: mobile ? 20 : 32 }}>
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ borderTop: '1px solid rgba(201,169,110,0.2)', paddingTop: 24 }}
              >
                <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 10 }}>{step.n}</div>
                <div style={{ fontSize: 18, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', marginBottom: 10 }}>{step.title}</div>
                <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.7 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Other pieces */}
        {otherPieces.length > 0 && (
          <section style={{ padding: mobile ? '0 24px 56px' : '0 80px 80px', borderTop: '1px solid rgba(201,169,110,0.08)' }}>
            <div style={{ paddingTop: 48, marginBottom: 36 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 8 }}>FROM THE ATELIER</div>
              <h3 style={{ fontSize: 34, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300 }}>Other pieces you may consider</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(3, 1fr)', gap: mobile ? 12 : 24 }}>
              {otherPieces.map(p => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/solo/piece/${p.slug}`)}
                  style={{
                    cursor: 'pointer', borderRadius: 3, overflow: 'hidden',
                    background: 'linear-gradient(135deg, #2E2822, #201C18)',
                    border: '1px solid rgba(201,169,110,0.1)',
                    padding: '24px',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(201,169,110,0.1)'}
                >
                  <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.45)', fontFamily: 'DM Sans', marginBottom: 8 }}>{p.code}</div>
                  <div style={{ fontSize: 17, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: '#C9A96E', fontFamily: 'DM Sans' }}>{formatPrice(p.price, p.price_egp)}</div>
                </div>
              ))}
            </div>
          </section>
        )}
        <SoloFooter />
      </div>
    </div>
  )
}
