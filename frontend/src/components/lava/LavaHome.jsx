import { useState, useEffect, useRef, useCallback } from 'react'
import { formatPrice } from '../../utils/price'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LavaNav from './LavaNav'
import LavaFooter from './LavaFooter'
import LavaWordmark from '../shared/LavaWordmark'
import CollectionCard from '../shared/CollectionCard'
import ProductSilhouette from '../shared/ProductSilhouette'
import { useCart } from '../../context/CartContext'
import { getProducts } from '../../services/api'
import { useLanguage } from '../../context/LanguageContext'
import { subscribeNewsletter } from '../../services/api'
import { useMobile } from '../../hooks/useMobile'
import { useContent } from '../../context/ContentContext'

const PAGE_BG = 'linear-gradient(160deg, #E8906A 0%, #D96A8A 40%, #8B6FB8 100%)'
const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } }

/* Light glass card for warm bg */
function WarmGlass({ children, style = {} }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.30)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.55)',
      borderRadius: 28,
      ...style
    }}>
      {children}
    </div>
  )
}

/* Dashed wave divider */
function WaveDivider() {
  return (
    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', display: 'block', marginBottom: -2 }}>
      <path
        d="M0 30 Q180 5 360 30 Q540 55 720 30 Q900 5 1080 30 Q1260 55 1440 30"
        stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="8 6"
        fill="none"
      />
    </svg>
  )
}

export default function LavaHome() {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const mobile = useMobile()
  const { get } = useContent()
  const { lang, t } = useLanguage()

  const [products, setProducts] = useState([])
  useEffect(() => {
    getProducts({ brand: 'lava' }).then(r => setProducts(r.data)).catch(() => {})
  }, [])

  const categories = ['All', ...new Set(products.map(p => p.cat).filter(Boolean))]
  const filtered = activeFilter === 'All'
    ? products
    : products.filter(p => p.cat === activeFilter)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) return
    try { await subscribeNewsletter(email, 'lava') } catch (_) {}
    setSubscribed(true)
  }

  return (
    <div style={{ background: PAGE_BG, minHeight: '100vh' }}>
      <LavaNav />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: '100vh', display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        alignItems: 'center', gap: mobile ? 32 : 48,
        padding: mobile ? '100px 24px 56px' : '120px 72px 80px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Aura blobs */}
        <div style={{
          position: 'absolute', width: 700, height: 700, borderRadius: '50%',
          top: '-20%', left: '-10%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(232,144,106,0.35) 0%, transparent 65%)',
          filter: 'blur(60px)', animation: 'aura1 16s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          bottom: '-10%', right: '-5%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(155,142,200,0.4) 0%, transparent 65%)',
          filter: 'blur(60px)', animation: 'aura2 20s ease-in-out infinite'
        }} />

        {/* LEFT: text */}
        <motion.div {...fadeUp} style={{ position: 'relative', zIndex: 1 }}>
          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.5)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 32,
            fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600,
            letterSpacing: 1.5, color: '#fff'
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', background: '#E8906A',
              boxShadow: '0 0 6px #E8906A', display: 'inline-block',
              animation: 'sparkle 1.5s ease-in-out infinite'
            }} />
            {get('lava.home.drop_label', 'DROP 04 — LIVE NOW')}
          </div>

          {/* Wordmark */}
          <div style={{ marginBottom: 24 }}>
            <LavaWordmark size={72} animate={true} />
          </div>

          {/* Description */}
          <p style={{
            fontSize: 18, fontFamily: 'DM Sans', fontWeight: 400,
            color: 'rgba(255,255,255,0.95)', lineHeight: 1.7,
            marginBottom: 40, maxWidth: 480
          }}>
            {get('lava.home.hero_text', 'The diffusion line that never asks permission. Bold prints, glowy textures, and color stories that refuse to behave.')}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 40 }}>
            <button
              onClick={() => navigate('/lava/collection')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: 16, fontFamily: 'DM Sans', fontWeight: 700,
                color: '#fff', letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 6
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              {get('lava.home.cta1', t('shop_drop'))}
            </button>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>·</span>
            <button
              onClick={() => navigate('/lava/story')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: 16, fontFamily: 'DM Sans', fontWeight: 400,
                color: 'rgba(255,255,255,0.75)'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >
              {t('read_vibe')}
            </button>
          </div>

          {/* Hashtag pills */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {['#nopermission', '#colorlouder', '#lavalavaclub'].map(tag => (
              <span key={tag} style={{
                background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.35)', borderRadius: 999,
                padding: '6px 16px', fontSize: 12, fontFamily: 'DM Sans',
                color: 'rgba(255,255,255,0.9)', letterSpacing: 0.5
              }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: hero product showcase */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <HeroShowcase products={products} navigate={navigate} t={t} lang={lang} addItem={addItem} />
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
        borderTop: '1px solid rgba(255,255,255,0.35)',
        borderBottom: '1px solid rgba(255,255,255,0.35)',
        padding: '16px 0', overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 22s linear infinite' }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} style={{
              fontSize: 12, letterSpacing: 3, fontFamily: 'DM Sans', fontWeight: 500,
              color: 'rgba(255,255,255,0.85)', paddingRight: 0
            }}>
              {get('lava.home.marquee', 'color, louder ✦ made for the fearless ✦ solar bloom ✦ drop 04 ✦') + ' '}
            </span>
          ))}
        </div>
      </div>

      {/* ── WAVE DIVIDER ────────────────────────────────────── */}
      <div style={{ padding: '20px 0 0' }}>
        <WaveDivider />
      </div>

      {/* ── LATEST DROP / COLLECTION ─────────────────────────── */}
      <section style={{ padding: mobile ? '48px 20px 56px' : '64px 72px 80px' }}>
        {/* Section header row */}
        <motion.div {...fadeUp} style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          marginBottom: 48, flexWrap: 'wrap', gap: 24
        }}>
          <div>
            <div style={{
              fontSize: 11, letterSpacing: 3, fontFamily: 'DM Sans', fontWeight: 600,
              color: 'rgba(255,255,255,0.75)', marginBottom: 8
            }}>
              {get('lava.home.collection_label', 'LATEST DROP')}
            </div>
            <div style={{ lineHeight: 1 }}>
              <span style={{
                fontFamily: 'Dancing Script', fontSize: 72, fontWeight: 700,
                color: '#fff', letterSpacing: -1
              }}>{get('lava.home.collection_h1', 'Color,')} </span>
              <span style={{
                fontFamily: 'Dancing Script', fontSize: 72, fontWeight: 700,
                color: '#F8E5A8'
              }}>{get('lava.home.collection_h2', 'louder.')}</span>
            </div>
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                style={{
                  padding: '8px 22px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontFamily: 'DM Sans', fontSize: 13, fontWeight: 500, letterSpacing: 0.5,
                  transition: 'all 0.2s ease',
                  background: activeFilter === cat ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(8px)',
                  color: activeFilter === cat ? '#8B6FB8' : 'rgba(255,255,255,0.9)',
                  border: activeFilter === cat ? 'none' : '1px solid rgba(255,255,255,0.35)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Product grid / slider */}
        {filtered.length > 3 ? (
          <LavaCollectionSlider
            products={filtered.slice(0, 12)}
            onAdd={p => addItem('lava', p, (p.sizes||[])[1]||'M')}
            navigate={navigate}
            t={t}
            lang={lang}
            mobile={mobile}
          />
        ) : (
          <motion.div
            {...fadeUp}
            style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 20 }}
          >
            {filtered.map(p => (
              <WarmCollectionCard key={p.id} product={p} onAdd={() => addItem('lava', p, (p.sizes||[])[1]||'M')} navigate={navigate} t={t} lang={lang} />
            ))}
          </motion.div>
        )}

        {/* View all */}
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: 48 }}>
          <button
            onClick={() => navigate('/lava/collection')}
            style={{
              padding: '13px 40px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.7)',
              cursor: 'pointer', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
              color: '#fff', fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
          >
            {t('view_all')} {filtered.length} {t('pieces').toUpperCase()}
          </button>
        </motion.div>
      </section>

      {/* ── MANIFESTO ───────────────────────────────────────── */}
      <section style={{
        padding: '100px 80px', textAlign: 'center',
        background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(4px)',
        borderTop: '1px solid rgba(255,255,255,0.25)',
        borderBottom: '1px solid rgba(255,255,255,0.25)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: 600, height: 300, borderRadius: '50%',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none'
        }} />
        <motion.div {...fadeUp} style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <p style={{
            fontSize: 30, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300,
            color: '#fff', lineHeight: 1.65
          }}>
            "A second look. A last dance.<br />
            Color tastes different when you wear it<br />
            without permission."
          </p>
        </motion.div>
      </section>

      {/* ── FEATURED PRODUCTS ───────────────────────────────── */}
      <section style={{ padding: mobile ? '56px 20px' : '80px 72px' }}>
        <motion.div {...fadeUp} style={{ marginBottom: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', marginBottom: 8 }}>
            {get('lava.home.featured_label', 'DROP 04')}
          </div>
          <h2 style={{ fontSize: 38, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400, color: '#fff' }}>
            {get('lava.home.featured_heading', 'Pieces from the Drop')}
          </h2>
        </motion.div>
        <motion.div {...fadeUp} style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobile ? 16 : 24, maxWidth: 1100, margin: '0 auto' }}>
          {products.slice(0, 4).map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/lava/product/${p.slug}`)}
              style={{ cursor: 'pointer', borderRadius: 20, overflow: 'hidden', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.35)', transition: 'transform 0.25s ease, box-shadow 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.18)` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ background: `linear-gradient(145deg, ${p.palette[0]}, ${p.palette[1]}, ${p.palette[2]})`, height: mobile ? 140 : 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ProductSilhouette type={p.silhouette} palette={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.35)']} width={mobile ? 70 : 90} height={mobile ? 110 : 140} />
              </div>
              <div style={{ padding: mobile ? '12px 14px' : '16px 18px' }}>
                {p.tag && <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.65)', fontFamily: 'DM Sans', marginBottom: 4 }}>{p.tag.toUpperCase()}</div>}
                <div style={{ fontSize: mobile ? 13 : 15, fontFamily: 'Cormorant Garamond', fontWeight: 600, color: '#fff', marginBottom: 4, lineHeight: 1.2 }}>{p.name}</div>
                <div style={{ fontSize: mobile ? 11 : 12, fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{p.sub}</div>
                <div style={{ fontSize: mobile ? 13 : 14, fontFamily: 'DM Sans', fontWeight: 600, color: '#fff' }}>{formatPrice(p.price, p.price_egp)}</div>
              </div>
            </div>
          ))}
        </motion.div>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginTop: 36 }}>
          <button
            onClick={() => navigate('/lava/collection')}
            style={{ padding: '14px 40px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.55)', color: '#fff', fontSize: 13, fontFamily: 'DM Sans', letterSpacing: 2, cursor: 'pointer', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', transition: 'background 0.2s ease' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.22)'}
          >
            VIEW ALL PIECES
          </button>
        </motion.div>
      </section>

      {/* ── NEWSLETTER ──────────────────────────────────────── */}
      <section style={{ padding: mobile ? '20px 20px 56px' : '20px 72px 80px' }}>
        <motion.div {...fadeUp} style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255,255,255,0.28)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.55)',
            borderRadius: 32, padding: '48px', textAlign: 'center'
          }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', marginBottom: 16 }}>
              {get('lava.home.newsletter_label', 'THE DROP LIST')}
            </div>
            <h3 style={{ fontSize: 28, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#fff', marginBottom: 8 }}>
              {get('lava.home.newsletter_heading', 'Stay on the drop list')}
            </h3>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'DM Sans', marginBottom: 32, lineHeight: 1.6 }}>
              {get('lava.home.newsletter_body', 'Early access to every drop. First to know, first to shop.')}
            </p>
            {subscribed ? (
              <div style={{ color: '#fff', fontSize: 16, fontFamily: 'DM Sans', padding: '16px 0', fontWeight: 500 }}>
                ✦ You're on the list. Watch for the next drop.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 10 }}>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com" required
                  style={{
                    flex: 1, padding: '12px 20px', borderRadius: 999,
                    border: '1.5px solid rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.35)',
                    color: '#1a0020', fontSize: 14, fontFamily: 'DM Sans', outline: 'none'
                  }}
                />
                <button type="submit" style={{
                  padding: '12px 28px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(90deg, #E8906A, #D96A8A)',
                  color: '#fff', fontSize: 12, fontWeight: 700,
                  fontFamily: 'DM Sans', letterSpacing: 1, whiteSpace: 'nowrap'
                }}>
                  {t('join')}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </section>

      <LavaFooter />
    </div>
  )
}

/* ── Hero product showcase (fan of floating cards) ─────────────────────── */
function ProductHeroCard({ product, isActive, navigate, t, lang, addItem }) {
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    addItem('lava', product, (product.sizes || [])[1] || 'M')
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div style={{
      width: 210, height: 330,
      borderRadius: 28, overflow: 'hidden',
      background: `linear-gradient(150deg, ${product.palette[0]}, ${product.palette[1]}, ${product.palette[2]})`,
      border: `2px solid rgba(255,255,255,${isActive ? 0.65 : 0.35})`,
      boxShadow: isActive
        ? `0 32px 72px ${product.palette[0]}60, 0 12px 32px rgba(0,0,0,0.18)`
        : `0 8px 24px rgba(0,0,0,0.12)`,
      position: 'relative',
      userSelect: 'none',
    }}>
      {/* Tag */}
      {product.tag && (
        <div style={{
          position: 'absolute', top: 11, left: 11, zIndex: 2,
          background: 'rgba(255,255,255,0.92)', color: '#8B6FB8',
          fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
          padding: '4px 10px', borderRadius: 999, fontFamily: 'DM Sans',
        }}>
          {product.tag.toUpperCase()}
        </div>
      )}

      {/* Heart */}
      <div style={{
        position: 'absolute', top: 11, right: 11, zIndex: 2,
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
      }}>♡</div>

      {/* Image / silhouette */}
      <div
        onClick={() => navigate(`/lava/product/${product.slug}`)}
        style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer' }}
      >
        <div style={{
          position: 'absolute', width: 150, height: 150, borderRadius: '50%',
          background: 'rgba(255,255,255,0.28)', filter: 'blur(28px)',
        }} />
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', position: 'absolute', inset: 0 }} />
          : <ProductSilhouette type={product.silhouette} palette={['rgba(255,255,255,0.88)', 'rgba(255,255,255,0.65)', 'rgba(255,255,255,0.42)']} width={100} height={165} />
        }
      </div>

      {/* Footer */}
      <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)', padding: '11px 14px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: 'DM Sans', color: '#1a0020', marginBottom: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {(lang === 'ar' && product.name_ar) ? product.name_ar : product.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', color: '#1a0020' }}>
            {formatPrice(product.price, product.price_egp)}
          </span>
          {isActive && (
            <button onClick={handleAdd} style={{
              padding: '5px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: added ? '#22c55e' : `linear-gradient(90deg, ${product.palette[0]}, ${product.palette[1]})`,
              color: '#fff', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans',
              transition: 'background 0.3s', letterSpacing: 0.5,
            }}>
              {added ? '✓' : t('add')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function HeroShowcase({ products, navigate, t, lang, addItem }) {
  const safeProducts = products.filter(p => Array.isArray(p.palette) && p.palette.length >= 3)
  const total = Math.min(safeProducts.length, 5)
  const [active, setActive] = useState(0)
  const paused = useRef(false)
  const touchStart = useRef(null)

  const go = useCallback((dir) => {
    setActive(prev => (prev + dir + total) % total)
  }, [total])

  useEffect(() => {
    if (total < 2) return
    const timer = setInterval(() => { if (!paused.current) go(1) }, 4000)
    return () => clearInterval(timer)
  }, [go, total])

  const activeProduct = safeProducts[active % Math.max(total, 1)] || null
  const STEP = 155

  /* ── empty / loading state ── */
  if (!activeProduct) {
    return (
      <div style={{ width: 420, height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', opacity: 0.4 }}>
          <div style={{ fontSize: 48, fontFamily: 'Dancing Script', color: '#fff', marginBottom: 12 }}>Drop 04</div>
          <div style={{ fontSize: 11, letterSpacing: 3, fontFamily: 'DM Sans', color: '#fff' }}>LOADING PIECES…</div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{ position: 'relative', width: 520, height: 480, userSelect: 'none' }}
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
      <style>{`@keyframes lavaFloat{0%,100%{transform:translateY(-8px)}50%{transform:translateY(8px)}}`}</style>

      {/* Breathing palette glow */}
      <motion.div
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 'calc(50% - 210px)', left: 'calc(50% - 160px)',
          width: 320, height: 420, borderRadius: '50%',
          background: `radial-gradient(ellipse at 50% 55%, ${activeProduct.palette[0]}55 0%, ${activeProduct.palette[1]}28 50%, transparent 72%)`,
          filter: 'blur(55px)', pointerEvents: 'none', zIndex: 0,
          transition: 'background 0.8s ease',
        }}
      />

      {/* Sparkles */}
      {[
        { top: '10%', left: '7%',   size: 6, delay: '0s',   dur: '2.4s' },
        { top: '18%', left: '88%',  size: 5, delay: '0.9s', dur: '3s'   },
        { top: '72%', left: '4%',   size: 4, delay: '1.5s', dur: '2.7s' },
        { top: '63%', left: '91%',  size: 7, delay: '0.4s', dur: '3.2s' },
      ].map((s, i) => (
        <div key={i} style={{
          position: 'absolute', width: s.size, height: s.size, borderRadius: '50%',
          background: '#fff', opacity: 0.5,
          top: s.top, left: s.left,
          animation: `sparkle ${s.dur} ${s.delay} ease-in-out infinite`,
          pointerEvents: 'none', zIndex: 0,
        }} />
      ))}

      {/* Cards — same proven pattern as LavaCollectionSlider */}
      {safeProducts.slice(0, total).map((p, i) => {
        let d = i - active
        if (d > total / 2) d -= total
        if (d < -total / 2) d += total
        const abs = Math.abs(d)
        const tx = d * STEP
        const scale = abs === 0 ? 1 : abs === 1 ? 0.8 : abs === 2 ? 0.63 : 0.5
        const opacity = abs === 0 ? 1 : abs === 1 ? 0.62 : abs === 2 ? 0.22 : 0
        const rotate = d * 7
        const zIndex = 20 - abs * 4

        return (
          <div
            key={p.id}
            onClick={() => abs > 0 && setActive(i)}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${tx}px), -50%) scale(${scale}) rotate(${rotate}deg)`,
              willChange: 'transform',
              transition: 'transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.65s ease',
              zIndex,
              opacity,
              pointerEvents: abs <= 2 ? 'auto' : 'none',
              cursor: abs > 0 ? 'pointer' : 'default',
            }}
          >
            <div style={{ animation: abs === 0 ? 'lavaFloat 3.8s ease-in-out infinite' : 'none' }}>
              <ProductHeroCard product={p} isActive={abs === 0} navigate={navigate} t={t} lang={lang} addItem={addItem} />
            </div>
          </div>
        )
      })}

      {/* Dot nav */}
      {total > 1 && (
        <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, display: 'flex', gap: 7, justifyContent: 'center', zIndex: 30 }}>
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              width: i === active ? 28 : 7, height: 7, borderRadius: 999, padding: 0, border: 'none', cursor: 'pointer',
              background: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.35s ease',
            }} />
          ))}
        </div>
      )}
    </div>
  )
}

/* Coverflow slider for Lava Lava collection */
function LavaCollectionSlider({ products, onAdd, navigate, t, lang, mobile }) {
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

  const CARD_W = mobile ? 260 : 300
  const STEP = mobile ? 275 : 340

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
      <div style={{ position: 'relative', height: mobile ? 360 : 440, overflow: 'hidden' }}>
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
              <WarmCollectionCard
                product={p}
                onAdd={() => onAdd(p)}
                navigate={navigate}
                t={t}
                lang={lang}
              />
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
            position: 'absolute', [side]: mobile ? 8 : 20, top: '45%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.5)', borderRadius: '50%',
            width: 42, height: 42, cursor: 'pointer',
            color: '#fff', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 30, transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.45)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
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
              background: i === active ? '#fff' : 'rgba(255,255,255,0.4)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.35s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* Warm-toned collection card for the light gradient background */
function WarmCollectionCard({ product, onAdd, navigate, t, lang }) {
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    setAdded(true)
    onAdd?.(product)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      onClick={() => navigate(`/lava/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 24, overflow: 'hidden', cursor: 'pointer',
        background: `linear-gradient(145deg, ${product.palette[0]}, ${product.palette[1]}, ${product.palette[2]})`,
        boxShadow: hovered
          ? `0 20px 48px ${product.palette[0]}55, 0 4px 16px rgba(0,0,0,0.1)`
          : `0 4px 20px ${product.palette[0]}30`,
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.3s ease', position: 'relative',
        border: '1.5px solid rgba(255,255,255,0.4)'
      }}
    >
      {/* Tag */}
      {product.tag && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          background: 'rgba(255,255,255,0.9)', color: '#8B6FB8',
          fontSize: 10, fontWeight: 700, letterSpacing: 1,
          padding: '4px 12px', borderRadius: 999, fontFamily: 'DM Sans'
        }}>
          {product.tag}
        </div>
      )}

      {/* Heart */}
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 2,
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, cursor: 'pointer'
      }}>
        ♡
      </div>

      {/* Silhouette area */}
      <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(255,255,255,0.25)', filter: 'blur(24px)'
        }} />
        <ProductSilhouette
          type={product.silhouette}
          palette={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)']}
          width={90} height={150}
        />
      </div>

      {/* Info bar */}
      <div style={{
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(8px)',
        padding: '14px 16px'
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans', color: '#1a0020', marginBottom: 2 }}>
          {(lang === 'ar' && product.name_ar) ? product.name_ar : product.name}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.5)', fontFamily: 'DM Sans' }}>
            {formatPrice(product.price, product.price_egp)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              padding: '5px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: added ? '#22c55e' : `linear-gradient(90deg, ${product.palette[0]}, ${product.palette[1]})`,
              color: '#fff', fontSize: 11, fontWeight: 700,
              fontFamily: 'DM Sans', transition: 'background 0.3s ease'
            }}
          >
            {added ? '✓' : t('add')}
          </button>
        </div>
      </div>
    </div>
  )
}
