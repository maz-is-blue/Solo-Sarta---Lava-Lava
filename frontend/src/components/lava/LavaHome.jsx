import { useState, useEffect } from 'react'
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
  const [heroAdded, setHeroAdded] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const mobile = useMobile()
  const { get } = useContent()
  const { lang, t } = useLanguage()

  const [products, setProducts] = useState([])
  useEffect(() => {
    getProducts({ brand: 'lava' }).then(r => setProducts(r.data)).catch(() => {})
  }, [])

  const featured = products[0] || null
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

  const handleHeroAdd = () => {
    if (!featured) return
    addItem('lava', featured, (featured.sizes || [])[1] || 'M')
    setHeroAdded(true)
    setTimeout(() => setHeroAdded(false), 2000)
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

        {/* RIGHT: featured product card — hidden on mobile or when no products */}
        {!mobile && featured && <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 32, overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(139,111,184,0.2), 0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.9)'
          }}>
            {/* Badge */}
            <div style={{ padding: '18px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                background: 'rgba(139,111,184,0.12)', color: '#8B6FB8',
                fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                padding: '5px 12px', borderRadius: 999, fontFamily: 'DM Sans'
              }}>
                ★ FEATURED
              </span>
              <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', fontFamily: 'DM Sans', letterSpacing: 1 }}>01 / 12</span>
            </div>

            {/* Silhouette area */}
            <div style={{
              height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `linear-gradient(135deg, ${featured.palette[0]}25, ${featured.palette[1]}18, ${featured.palette[2]}25)`,
              position: 'relative', margin: '12px 0 0'
            }}>
              <div style={{
                position: 'absolute', width: 220, height: 220, borderRadius: '50%',
                background: `radial-gradient(circle, ${featured.palette[0]}35 0%, transparent 70%)`,
                filter: 'blur(40px)'
              }} />
              <ProductSilhouette type={featured.silhouette} palette={featured.palette} width={150} height={230} />
            </div>

            {/* Product info */}
            <div style={{ padding: '20px 28px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'DM Sans', color: '#1a0020', marginBottom: 3 }}>
                    {featured.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', fontFamily: 'DM Sans' }}>
                    Bias-cut · viscose · sunset rose
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'DM Sans', color: '#1a0020' }}>
                    ₹{featured.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', fontFamily: 'DM Sans' }}>
                    or 3× ₹{Math.round(featured.price / 3).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Color dots + loved */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0' }}>
                {featured.palette.map((c, i) => (
                  <div key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                ))}
                <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', fontFamily: 'DM Sans', marginLeft: 4 }}>
                  2.4k loved this drop
                </span>
              </div>

              {/* Add to bag + heart */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleHeroAdd}
                  style={{
                    flex: 1, padding: '13px 0', borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: heroAdded
                      ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                      : `linear-gradient(90deg, ${featured.palette[0]}, ${featured.palette[1]})`,
                    color: '#fff', fontSize: 14, fontWeight: 700,
                    fontFamily: 'DM Sans', letterSpacing: 0.5,
                    transition: 'background 0.3s ease'
                  }}
                >
                  {heroAdded ? t('added') : t('add_to_bag')}
                </button>
                <button style={{
                  width: 48, height: 48, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.15)',
                  background: '#fff', cursor: 'pointer', fontSize: 18,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, transition: 'border-color 0.2s ease'
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = featured.palette[0]}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)'}
                >
                  ♡
                </button>
              </div>
            </div>
          </div>
        </motion.div>}
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

        {/* Product grid */}
        <motion.div
          {...fadeUp}
          style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 20 }}
        >
          {filtered.slice(0, 8).map(p => (
            <WarmCollectionCard key={p.id} product={p} onAdd={() => addItem('lava', p, (p.sizes||[])[1]||'M')} navigate={navigate} t={t} lang={lang} />
          ))}
        </motion.div>

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
                <div style={{ fontSize: mobile ? 13 : 14, fontFamily: 'DM Sans', fontWeight: 600, color: '#fff' }}>₹{p.price.toLocaleString()}</div>
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
            ₹{product.price.toLocaleString()}
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
