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

function Accordion({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', padding: '12px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', color: '#FAF8F5',
        }}
      >
        <span style={{ fontSize: 10, letterSpacing: 2.5, fontFamily: 'DM Sans' }}>{label}</span>
        <span style={{
          color: '#C9A96E', fontSize: 14, lineHeight: 1,
          display: 'inline-block',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>›</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 14 }}>
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
  const [loading, setLoading] = useState(true)
  const mobile = useMobile()
  const { lang, t } = useLanguage()

  useEffect(() => {
    setLoading(true)
    getProduct(slug)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
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

  if (loading) {
    return (
      <div style={{ background: '#1C1812', minHeight: '100vh' }}>
        <SoloNav />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ background: '#1C1812', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
        <SoloNav />
        <p style={{ color: 'rgba(250,248,245,0.45)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 22 }}>This piece has moved on.</p>
        <button onClick={() => navigate('/solo/collection')} style={{ background: 'none', border: '1px solid rgba(201,169,110,0.35)', color: '#C9A96E', padding: '10px 24px', cursor: 'pointer', fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2 }}>
          ← COLLECTION
        </button>
      </div>
    )
  }

  const displayName = (lang === 'ar' && product.name_ar) ? product.name_ar : product.name
  const desc = (lang === 'ar' && product.product_desc_ar) ? product.product_desc_ar : product.product_desc

  /* ── MOBILE ── */
  if (mobile) {
    return (
      <div style={{ background: '#1C1812', minHeight: '100vh', color: '#FAF8F5' }}>
        <SoloNav />
        <div style={{ paddingTop: 88 }}>
          <div style={{ padding: '32px 24px 16px' }}>
            {/* Image */}
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#211C17', marginBottom: 16 }}>
              {displayImages[selectedImg]
                ? <img src={displayImages[selectedImg]} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 28, color: 'rgba(201,169,110,0.12)' }}>SS</span>
                  </div>
              }
            </div>
            {/* Pill nav */}
            {displayImages.length > 1 && (
              <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 28, alignItems: 'center' }}>
                {displayImages.map((_, idx) => (
                  <button key={idx} onClick={() => setSelectedImg(idx)} style={{
                    width: selectedImg === idx ? 26 : 12, height: 2, padding: 0, border: 'none', borderRadius: 1,
                    background: selectedImg === idx ? '#C9A96E' : 'rgba(201,169,110,0.22)',
                    cursor: 'pointer', transition: 'all 0.3s',
                  }} />
                ))}
              </div>
            )}
            {/* Info */}
            <div style={{ fontSize: 9, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 8 }}>{product.cat?.toUpperCase()}</div>
            <h1 style={{ fontSize: 30, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.1, marginBottom: 10 }}>{displayName}</h1>
            <div style={{ fontSize: 18, color: '#C9A96E', fontFamily: 'Cormorant Garamond', marginBottom: 18 }}>{formatPrice(product.price, product.price_egp)}</div>
            {desc && <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.85, marginBottom: 24 }}>{desc}</p>}
            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 10 }}>SIZE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s === selectedSize ? null : s)} style={{
                      minWidth: 50, height: 40, padding: '0 12px',
                      border: `1px solid ${selectedSize === s ? '#C9A96E' : 'rgba(201,169,110,0.2)'}`,
                      background: selectedSize === s ? 'rgba(201,169,110,0.08)' : 'transparent',
                      color: selectedSize === s ? '#C9A96E' : 'rgba(250,248,245,0.38)',
                      fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', transition: 'all 0.2s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              <button onClick={() => navigate('/solo/contact')} style={{ width: '100%', padding: '14px', border: 'none', cursor: 'pointer', background: '#C9A96E', color: '#1A1A1A', fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 2.5 }}>
                {t('request_fitting') || 'REQUEST A FITTING'}
              </button>
              <button onClick={() => { addItem('solo', product, selectedSize || 'Bespoke'); setAdded(true); setTimeout(() => setAdded(false), 2500) }}
                style={{ width: '100%', padding: '14px', cursor: 'pointer', border: '1px solid rgba(201,169,110,0.28)', background: 'transparent', color: added ? '#C9A96E' : 'rgba(250,248,245,0.45)', fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 2.5, transition: 'all 0.25s' }}>
                {added ? `✓ ADDED` : `♡  ${t('add_to_bag_btn') || 'ADD TO BAG'}`}
              </button>
            </div>
            <Accordion label="FEATURES OF THE PIECE">
              <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>{desc || 'Bespoke, hand-crafted in our Cairo atelier.'}</p>
            </Accordion>
            <Accordion label="DETAILS & DIMENSIONS">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[[t('fabric_label') || 'FABRIC', product.fabric], ['LEAD TIME', product.process_time]].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}><div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(201,169,110,0.35)', fontFamily: 'DM Sans', marginBottom: 2 }}>{k}</div><div style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans' }}>{v}</div></div>
                ))}
              </div>
            </Accordion>
            <Accordion label="THE ATELIER">
              <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>All commissions are by appointment only. Hand-drafted and constructed over several weeks.</p>
            </Accordion>
          </div>
        </div>
        <SoloFooter />
      </div>
    )
  }

  /* ── DESKTOP: 3-column ── */
  return (
    <div style={{ background: '#1C1812', minHeight: '100vh', color: '#FAF8F5' }}>
      <SoloNav />
      <div style={{ paddingTop: 88 }}>

        {/* breadcrumb */}
        <div style={{ padding: '12px 48px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span onClick={() => navigate('/solo/collection')}
            style={{ fontSize: 10, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', letterSpacing: 1.5, cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.4)'}
          >← COLLECTION</span>
          <span style={{ color: 'rgba(201,169,110,0.15)', fontSize: 9 }}>·</span>
          <span style={{ fontSize: 10, color: 'rgba(250,248,245,0.22)', fontFamily: 'DM Sans', letterSpacing: 1 }}>{displayName.toUpperCase()}</span>
        </div>

        {/* 3-column */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', alignItems: 'start' }}>

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ position: 'sticky', top: 88, maxHeight: 'calc(100vh - 88px)', overflowY: 'auto', scrollbarWidth: 'none', padding: '48px 36px 48px 56px' }}
          >
            <div style={{ fontSize: 10, letterSpacing: 3.5, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12 }}>{product.cat?.toUpperCase()}</div>
            <h1 style={{ fontSize: 36, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.08, marginBottom: 14 }}>{displayName}</h1>
            <div style={{ fontSize: 22, color: '#C9A96E', fontFamily: 'Cormorant Garamond', marginBottom: 24 }}>{formatPrice(product.price, product.price_egp)}</div>
            {desc && <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.48)', fontFamily: 'DM Sans', lineHeight: 1.9, marginBottom: 36 }}>{desc}</p>}

            <Accordion label="FEATURES OF THE PIECE">
              <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>
                {desc || 'Bespoke, hand-crafted in our Cairo atelier. Each detail considered, each seam finished by hand.'}
              </p>
            </Accordion>
            <Accordion label="DETAILS & DIMENSIONS">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  [t('fabric_label') || 'FABRIC', product.fabric],
                  ['LEAD TIME', product.process_time],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(201,169,110,0.35)', fontFamily: 'DM Sans', marginBottom: 3 }}>{k}</div>
                    <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans' }}>{v}</div>
                  </div>
                ))}
              </div>
            </Accordion>
            <Accordion label="THE ATELIER">
              <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.85 }}>
                All Solo Sarto commissions are by appointment only. Hand-drafted and constructed over several weeks.
              </p>
            </Accordion>
          </motion.div>

          {/* CENTER: photo */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 32px' }}
          >
            {/* Photo — constrained, not full-bleed */}
            <div style={{ width: '100%', maxWidth: 360, position: 'relative' }}>
              {/* Thin corner brackets only */}
              {[
                { top: -7, left: -7,  path: 'M18,0.5 L0.5,0.5 L0.5,18' },
                { top: -7, right: -7, path: 'M0.5,0.5 L18,0.5 L18,18' },
                { bottom: -7, left: -7,  path: 'M0.5,0.5 L0.5,18 L18,18' },
                { bottom: -7, right: -7, path: 'M0.5,18 L18,18 L18,0.5' },
              ].map((c, i) => (
                <svg key={i} width={19} height={19} viewBox="0 0 19 19" style={{ position: 'absolute', zIndex: 2, pointerEvents: 'none', top: c.top, left: c.left, right: c.right, bottom: c.bottom }}>
                  <path d={c.path} fill="none" stroke="#C9A96E" strokeWidth="1.1" opacity="0.55" />
                </svg>
              ))}

              <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#211C17' }}>
                {displayImages[selectedImg]
                  ? <img src={displayImages[selectedImg]} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 32, color: 'rgba(201,169,110,0.08)' }}>SS</span>
                    </div>
                }
              </div>
            </div>

            {/* Pill nav */}
            {displayImages.length > 1 && (
              <div style={{ display: 'flex', gap: 6, marginTop: 18, justifyContent: 'center', alignItems: 'center' }}>
                {displayImages.map((_, idx) => (
                  <button key={idx} onClick={() => setSelectedImg(idx)} style={{
                    width: selectedImg === idx ? 28 : 13, height: 2, padding: 0, border: 'none', borderRadius: 1,
                    background: selectedImg === idx ? '#C9A96E' : 'rgba(201,169,110,0.22)',
                    cursor: 'pointer', transition: 'all 0.3s ease',
                  }} />
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ position: 'sticky', top: 88, maxHeight: 'calc(100vh - 88px)', overflowY: 'auto', scrollbarWidth: 'none', padding: '48px 56px 48px 36px' }}
          >
            {/* Size */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>SIZE</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s === selectedSize ? null : s)} style={{
                      minWidth: 52, height: 42, padding: '0 12px',
                      border: `1px solid ${selectedSize === s ? '#C9A96E' : 'rgba(201,169,110,0.2)'}`,
                      background: selectedSize === s ? 'rgba(201,169,110,0.08)' : 'transparent',
                      color: selectedSize === s ? '#C9A96E' : 'rgba(250,248,245,0.38)',
                      fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', letterSpacing: 1, transition: 'all 0.2s',
                    }}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              <button
                onClick={() => navigate('/solo/contact')}
                style={{ width: '100%', padding: '14px', border: 'none', cursor: 'pointer', background: '#C9A96E', color: '#1A1A1A', fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 2.5, transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#D4B47C'}
                onMouseLeave={e => e.currentTarget.style.background = '#C9A96E'}
              >
                {t('request_fitting') || 'REQUEST A FITTING'}
              </button>
              <button
                onClick={() => { addItem('solo', product, selectedSize || 'Bespoke'); setAdded(true); setTimeout(() => setAdded(false), 2500) }}
                style={{ width: '100%', padding: '14px', cursor: 'pointer', border: '1px solid rgba(201,169,110,0.28)', background: 'transparent', color: added ? '#C9A96E' : 'rgba(250,248,245,0.42)', fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 2.5, transition: 'all 0.25s' }}
                onMouseEnter={e => { if (!added) { e.currentTarget.style.borderColor = '#C9A96E'; e.currentTarget.style.color = '#C9A96E' } }}
                onMouseLeave={e => { if (!added) { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.28)'; e.currentTarget.style.color = 'rgba(250,248,245,0.42)' } }}
              >
                {added ? `✓ ADDED TO BAG` : `♡  ${t('add_to_bag_btn') || 'ADD TO BAG'}`}
              </button>
            </div>

            <p style={{ fontSize: 10, color: 'rgba(250,248,245,0.15)', fontFamily: 'DM Sans', lineHeight: 1.7 }}>
              Prices are indicative. Final cost confirmed after consultation.<br />All pieces are non-returnable — made only for you.
            </p>
          </motion.div>
        </section>

        {/* You may also like */}
        {otherPieces.length > 0 && (
          <section style={{ padding: '48px 72px 72px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
              <h3 style={{ fontSize: 32, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300 }}>You May Also Like</h3>
              <button onClick={() => navigate('/solo/collection')}
                style={{ background: 'none', border: 'none', color: 'rgba(201,169,110,0.38)', cursor: 'pointer', fontSize: 10, fontFamily: 'DM Sans', letterSpacing: 2 }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.38)'}
              >VIEW ALL →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(otherPieces.length, 4)}, 1fr)`, gap: 20 }}>
              {otherPieces.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  onClick={() => { navigate(`/solo/piece/${p.slug}`); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#211C17', marginBottom: 12 }}>
                    {p.image_url
                      ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block', transition: 'transform 0.6s ease' }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                      : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 20, color: 'rgba(201,169,110,0.08)' }}>SS</span>
                        </div>
                    }
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: 2.5, color: 'rgba(201,169,110,0.38)', fontFamily: 'DM Sans', marginBottom: 4 }}>{p.cat?.toUpperCase()}</div>
                  <div style={{ fontSize: 16, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 4, lineHeight: 1.2 }}>{p.name}</div>
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
