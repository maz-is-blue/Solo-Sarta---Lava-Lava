import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import SoloNav from './SoloNav'
import SoloFooter from './SoloFooter'
import { getProducts } from '../../services/api'
import { useMobile } from '../../hooks/useMobile'
import { useContent } from '../../context/ContentContext'
import { useLanguage } from '../../context/LanguageContext'
import { SOLO_CATS } from '../../constants/soloCategories'

const GRAIN = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'

function Silhouette({ uid }) {
  return (
    <svg width="110" height="180" viewBox="0 0 120 200" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`g${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A96E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#E8D5A3" stopOpacity="0.5" />
        </linearGradient>
        <filter id={`f${uid}`}>
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d="M45,20 Q42,12 60,8 Q78,12 75,20 L85,80 Q60,90 35,80 Z" fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.35" />
      <path d="M35,80 Q10,130 20,195 Q60,200 100,195 Q110,130 85,80" fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.35" />
      <path d="M45,20 Q42,12 60,8 Q78,12 75,20 L85,80 Q100,130 95,195 Q60,200 25,195 Q20,130 35,80 Z" fill={`url(#g${uid})`} opacity="0.8" filter={`url(#f${uid})`} />
      <line x1="52" y1="8" x2="48" y2="20" stroke="#C9A96E" strokeWidth="1.2" opacity="0.5" />
      <line x1="68" y1="8" x2="72" y2="20" stroke="#C9A96E" strokeWidth="1.2" opacity="0.5" />
      <path d="M38,78 Q60,86 82,78" fill="none" stroke="#C9A96E" strokeWidth="0.7" opacity="0.4" />
    </svg>
  )
}

function PieceCard({ product, lang }) {
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()
  const displayName = (lang === 'ar' && product.name_ar) ? product.name_ar : product.name

  return (
    <div
      onClick={() => navigate(`/solo/piece/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: 3,
        background: 'linear-gradient(135deg, #2E2822 0%, #201C18 100%)',
        border: `1px solid ${hovered ? 'rgba(201,169,110,0.35)' : 'rgba(201,169,110,0.12)'}`,
        transition: 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.3s ease',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 56px rgba(0,0,0,0.6)' : '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none', backgroundImage: GRAIN, backgroundSize: 'cover' }} />
      <div style={{ position: 'absolute', top: 16, left: 16, fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans' }}>{product.code}</div>
      <div style={{ position: 'absolute', top: 16, right: 16, fontSize: 10, letterSpacing: 1.5, color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans' }}>{product.cat?.toUpperCase()}</div>

      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(201,169,110,0.06), rgba(201,169,110,0.02))', overflow: 'hidden', position: 'relative' }}>
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
          : <Silhouette uid={product.id} />
        }
      </div>

      <div style={{ padding: '20px 20px 24px' }}>
        <div style={{ fontSize: 18, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 6 }}>
          {displayName}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#C9A96E', fontFamily: 'DM Sans' }}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize: 10, letterSpacing: 1.5, color: hovered ? '#C9A96E' : 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', transition: 'color 0.25s ease' }}>
            VIEW →
          </span>
        </div>
      </div>
    </div>
  )
}

export default function SoloCollection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeCat = searchParams.get('cat') || null

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const mobile = useMobile()
  const { get } = useContent()
  const { lang, t } = useLanguage()

  useEffect(() => {
    getProducts({ brand: 'solo' })
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCat ? products.filter(p => p.cat === activeCat) : products

  const setFilter = (cat) => {
    navigate(cat ? `/solo/collection?cat=${encodeURIComponent(cat)}` : '/solo/collection')
  }

  const catBtnStyle = (active) => ({
    padding: '7px 20px', borderRadius: 999, cursor: 'pointer',
    border: `1px solid ${active ? '#C9A96E' : 'rgba(201,169,110,0.25)'}`,
    background: active ? '#C9A96E' : 'transparent',
    color: active ? '#1A1A1A' : 'rgba(250,248,245,0.6)',
    fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 1.5,
    fontWeight: active ? 600 : 400, transition: 'all 0.25s ease',
  })

  return (
    <div style={{ background: '#2A2420', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />
      <SoloNav />

      <div style={{ paddingTop: 110, position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          style={{ padding: mobile ? '32px 24px 0' : '48px 80px 0' }}>

          {/* Breadcrumb */}
          {activeCat && (
            <div style={{ fontSize: 11, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', letterSpacing: 1.5, marginBottom: 14, display: 'flex', gap: 8 }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setFilter(null)}>ALL</span>
              <span>›</span>
              <span style={{ color: '#C9A96E' }}>{activeCat.toUpperCase()}</span>
            </div>
          )}

          <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12 }}>
            {get('solo.collection.season', "AUTUMN / WINTER '26")}
          </div>
          <h1 style={{ fontSize: 52, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, marginBottom: 8, lineHeight: 1.1 }}>
            {activeCat || get('solo.collection.heading', 'The Collection')}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.45)', fontFamily: 'DM Sans', marginBottom: 36 }}>
            {loading ? t('loading') : `${filtered.length} ${t('pieces')}`}{t('no_two_alike')}
          </p>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 48 }}>
            <button onClick={() => setFilter(null)} style={catBtnStyle(!activeCat)}>ALL</button>
            {SOLO_CATS.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={catBtnStyle(activeCat === cat)}>
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div style={{ padding: mobile ? '0 24px 56px' : '0 80px 80px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', fontSize: 13 }}>{t('loading')}</div>
          ) : (
            <motion.div
              key={activeCat}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: mobile ? 12 : 24 }}
            >
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.07 }}>
                  <PieceCard product={p} lang={lang} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(250,248,245,0.3)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 22 }}>
              {t('no_pieces_yet')}
            </div>
          )}
        </div>

        <div style={{ background: '#FAF8F5', padding: '48px 80px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(26,26,26,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>{t('bespoke_enquiries')}</div>
          <p style={{ fontSize: 15, color: 'rgba(26,26,26,0.6)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', marginBottom: 24 }}>
            Each piece is made to measure. Prices are a guide — your commission is a conversation.
          </p>
        </div>
      </div>
      <SoloFooter />
    </div>
  )
}
