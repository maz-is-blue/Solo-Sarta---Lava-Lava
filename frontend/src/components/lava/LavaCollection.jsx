import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import LavaNav from './LavaNav'
import LavaFooter from './LavaFooter'
import CollectionCard from '../shared/CollectionCard'
import { LAVA_PRODUCTS, LAVA_CATEGORIES } from '../../data/products'
import { useCart } from '../../context/CartContext'
import { useMobile } from '../../hooks/useMobile'
import { useContent } from '../../context/ContentContext'

export default function LavaCollection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const { addItem } = useCart()
  const mobile = useMobile()
  const { get } = useContent()

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return LAVA_PRODUCTS
    return LAVA_PRODUCTS.filter(p => p.cat === activeFilter)
  }, [activeFilter])

  return (
    <div style={{ background: 'linear-gradient(180deg, #0f0018 0%, #050010 100%)', minHeight: '100vh', color: '#fff' }}>
      <LavaNav />

      {/* Header */}
      <section style={{ paddingTop: mobile ? 100 : 140, paddingBottom: 40, paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 600, height: 400, top: 0, right: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(139,111,184,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>
            {get('lava.collection.drop_label', 'DROP 04 · SOLAR BLOOM')}
          </div>
          <h1 style={{ fontSize: 64, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400, marginBottom: 8 }}>
            {get('lava.collection.heading', 'The Collection')}
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans' }}>
            {filtered.length} piece{filtered.length !== 1 ? 's' : ''}
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section style={{ paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, marginBottom: 36 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {LAVA_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                padding: '10px 24px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 1,
                transition: 'all 0.25s ease',
                background: activeFilter === cat
                  ? 'linear-gradient(90deg, #E8906A, #D96A8A)'
                  : 'rgba(255,255,255,0.08)',
                color: activeFilter === cat ? '#fff' : 'rgba(255,255,255,0.6)',
                boxShadow: activeFilter === cat ? '0 4px 20px rgba(232,144,106,0.35)' : 'none'
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section style={{ paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, paddingBottom: 64 }}>
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 24 }}
        >
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <CollectionCard product={p} onAdd={prod => addItem('lava', prod, prod.sizes[1])} />
            </motion.div>
          ))}
        </motion.div>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>
            No pieces in this category yet.
          </div>
        )}
      </section>

      <LavaFooter />
    </div>
  )
}
