import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import LavaNav from './LavaNav'
import LavaFooter from './LavaFooter'
import CollectionCard from '../shared/CollectionCard'
import { getProducts } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useMobile } from '../../hooks/useMobile'
import { useContent } from '../../context/ContentContext'
import { useLanguage } from '../../context/LanguageContext'
import { LAVA_CATS, LAVA_CAT_NAMES } from '../../constants/lavaCategories'

export default function LavaCollection() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activeCat = searchParams.get('cat') || null
  const activeSub = searchParams.get('sub') || null

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const mobile = useMobile()
  const { get } = useContent()
  const { t } = useLanguage()

  useEffect(() => {
    getProducts({ brand: 'lava' })
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let result = products
    if (activeCat) result = result.filter(p => p.cat === activeCat)
    if (activeSub) result = result.filter(p => p.sub_cat === activeSub)
    return result
  }, [products, activeCat, activeSub])

  const setFilter = (cat, sub = null) => {
    if (!cat) { navigate('/lava/collection'); return }
    const qs = `?cat=${encodeURIComponent(cat)}${sub ? `&sub=${encodeURIComponent(sub)}` : ''}`
    navigate(`/lava/collection${qs}`)
  }

  const activeSubs = activeCat ? (LAVA_CATS[activeCat] || []) : []

  const catBtnStyle = (active) => ({
    padding: '9px 22px', borderRadius: 999, border: 'none', cursor: 'pointer',
    fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 1,
    transition: 'all 0.2s ease',
    background: active ? 'linear-gradient(90deg, #E8906A, #D96A8A)' : 'rgba(255,255,255,0.08)',
    color: active ? '#fff' : 'rgba(255,255,255,0.6)',
    boxShadow: active ? '0 4px 20px rgba(232,144,106,0.35)' : 'none',
  })

  const subBtnStyle = (active) => ({
    padding: '6px 16px', borderRadius: 999, border: `1px solid ${active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.15)'}`,
    cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 0.5,
    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
    color: active ? '#fff' : 'rgba(255,255,255,0.5)',
    transition: 'all 0.2s ease',
  })

  return (
    <div style={{ background: 'linear-gradient(180deg, #0f0018 0%, #050010 100%)', minHeight: '100vh', color: '#fff' }}>
      <LavaNav />

      {/* Header */}
      <section style={{ paddingTop: mobile ? 100 : 140, paddingBottom: 24, paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 600, height: 400, top: 0, right: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse, rgba(139,111,184,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        {/* Breadcrumb */}
        {activeCat && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans', marginBottom: 14, display: 'flex', gap: 8, alignItems: 'center', letterSpacing: 1 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setFilter(null)}>ALL</span>
            <span>›</span>
            <span style={{ cursor: 'pointer', color: activeSub ? 'rgba(255,255,255,0.35)' : '#fff' }} onClick={() => setFilter(activeCat)}>{activeCat.toUpperCase()}</span>
            {activeSub && (
              <>
                <span>›</span>
                <span style={{ color: '#fff' }}>{activeSub.toUpperCase()}</span>
              </>
            )}
          </div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>
            {get('lava.collection.drop_label', 'DROP 04 · SOLAR BLOOM')}
          </div>
          <h1 style={{ fontSize: mobile ? 40 : 64, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400, marginBottom: 8 }}>
            {activeSub || activeCat || get('lava.collection.heading', 'The Collection')}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans' }}>
            {loading ? t('loading') : `${filtered.length} ${t('pieces')}`}
          </p>
        </motion.div>
      </section>

      {/* Category filters */}
      <section style={{ paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={() => setFilter(null)} style={catBtnStyle(!activeCat)}>
            ALL
          </button>
          {LAVA_CAT_NAMES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} style={catBtnStyle(activeCat === cat)}>
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Subcategory filters — only visible when a category is active */}
      {activeSubs.length > 0 && (
        <section style={{ paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, marginBottom: 36, paddingTop: 4 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingLeft: 12, borderLeft: '2px solid rgba(255,255,255,0.12)' }}>
            <button onClick={() => setFilter(activeCat)} style={subBtnStyle(!activeSub)}>
              All {activeCat}
            </button>
            {activeSubs.map(sub => (
              <button key={sub} onClick={() => setFilter(activeCat, sub)} style={subBtnStyle(activeSub === sub)}>
                {sub}
              </button>
            ))}
          </div>
        </section>
      )}

      {!activeSubs.length && <div style={{ marginBottom: 36 }} />}

      {/* Product grid */}
      <section style={{ paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, paddingBottom: 64 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>{t('loading')}</div>
        ) : (
          <motion.div
            key={`${activeCat}-${activeSub}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 24 }}
          >
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                <CollectionCard product={p} onAdd={prod => addItem('lava', prod, (prod.sizes || [])[1] || 'M')} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>
            {t('no_pieces_yet')}
          </div>
        )}
      </section>

      <LavaFooter />
    </div>
  )
}
