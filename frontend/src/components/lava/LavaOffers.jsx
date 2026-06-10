import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LavaNav from './LavaNav'
import LavaFooter from './LavaFooter'
import { getProducts } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useMobile } from '../../hooks/useMobile'
import { useLanguage } from '../../context/LanguageContext'
import { formatPrice } from '../../utils/price'
import ProductSilhouette from '../shared/ProductSilhouette'

const PAGE_BG = 'linear-gradient(160deg, #E8906A 0%, #D96A8A 40%, #8B6FB8 100%)'
const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } }

function OfferCard({ product, onAdd, navigate }) {
  const [added, setAdded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleAdd = (e) => {
    e.stopPropagation()
    setAdded(true)
    onAdd?.(product)
    setTimeout(() => setAdded(false), 1800)
  }

  const isLimited = product.tag === 'Limited'
  const isNew = product.tag === 'New'
  const isSale = product.tag === 'Sale'

  const tagColor = isSale
    ? { bg: 'rgba(255,100,80,0.9)', text: '#fff' }
    : isLimited
    ? { bg: 'rgba(255,255,255,0.9)', text: '#8B6FB8' }
    : { bg: 'rgba(255,255,255,0.9)', text: '#E8906A' }

  return (
    <div
      onClick={() => navigate(`/lava/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 24, overflow: 'hidden', cursor: 'pointer',
        background: `linear-gradient(145deg, ${product.palette[0]}, ${product.palette[1]}, ${product.palette[2]})`,
        boxShadow: hovered
          ? `0 24px 56px ${product.palette[0]}55, 0 4px 16px rgba(0,0,0,0.15)`
          : `0 6px 24px ${product.palette[0]}30`,
        transform: hovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.35s ease', position: 'relative',
        border: '1.5px solid rgba(255,255,255,0.45)',
      }}
    >
      {product.tag && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 2,
          background: tagColor.bg, color: tagColor.text,
          fontSize: 10, fontWeight: 700, letterSpacing: 1.5,
          padding: '5px 14px', borderRadius: 999, fontFamily: 'DM Sans',
        }}>
          {product.tag.toUpperCase()}
        </div>
      )}
      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 2,
        width: 32, height: 32, borderRadius: '50%',
        background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
      }}>
        ♡
      </div>

      <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', filter: 'blur(24px)' }} />
        {product.image_url
          ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', position: 'absolute', inset: 0 }} />
          : <ProductSilhouette type={product.silhouette} palette={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.4)']} width={90} height={150} />
        }
      </div>

      <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '14px 16px 18px' }}>
        <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans', color: '#1a0020', marginBottom: 2 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(26,0,32,0.5)', fontFamily: 'DM Sans', marginBottom: 12 }}>
          {product.sub}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'DM Sans', color: isSale ? '#e03e1c' : '#1a0020' }}>
            {formatPrice(product.price, product.price_egp)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 1,
              background: added ? '#22c55e' : `linear-gradient(90deg, ${product.palette[0]}, ${product.palette[1]})`,
              color: '#fff', transition: 'background 0.3s',
            }}
          >
            {added ? '✓ ADDED' : 'ADD'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function LavaOffers() {
  const navigate = useNavigate()
  const mobile = useMobile()
  const { addItem } = useCart()
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts({ brand: 'lava' })
      .then(r => setProducts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const offers = products.filter(p => p.tag && p.tag !== '')
  const tagGroups = ['Sale', 'Limited', 'New', 'Featured', 'Restock']

  return (
    <div style={{ minHeight: '100vh', background: PAGE_BG }}>
      <LavaNav />

      {/* Hero banner */}
      <section style={{ paddingTop: mobile ? 100 : 120, paddingBottom: 60, textAlign: 'center', padding: mobile ? '100px 24px 60px' : '120px 80px 60px' }}>
        <motion.div {...fadeUp}>
          <div style={{ fontSize: 11, letterSpacing: 3, fontFamily: 'DM Sans', fontWeight: 600, color: 'rgba(255,255,255,0.75)', marginBottom: 16 }}>
            EXCLUSIVE DROPS
          </div>
          <h1 style={{ fontFamily: 'Dancing Script', fontSize: mobile ? 52 : 80, fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1.1 }}>
            Offers & <span style={{ color: '#F8E5A8' }}>Limited Editions</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: 15, color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: '0 auto', lineHeight: 1.8 }}>
            Discounts, limited-run pieces, and exclusive drops — all in one place. Updated when new offers are available.
          </p>
        </motion.div>
      </section>

      {/* Offers grid */}
      <section style={{ padding: mobile ? '0 16px 80px' : '0 80px 80px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans' }}>Loading…</div>
        ) : offers.length === 0 ? (
          <motion.div {...fadeUp} style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 20, opacity: 0.4 }}>◇</div>
            <p style={{ fontFamily: 'Dancing Script', fontSize: 28, color: '#fff', marginBottom: 12 }}>No offers right now.</p>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
              Check back soon — new drops are always on the way.
            </p>
            <button
              onClick={() => navigate('/lava/collection')}
              style={{ padding: '13px 36px', borderRadius: 999, border: '1.5px solid rgba(255,255,255,0.7)', cursor: 'pointer', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontFamily: 'DM Sans', letterSpacing: 2, fontWeight: 600 }}
            >
              BROWSE ALL PIECES
            </button>
          </motion.div>
        ) : (
          <>
            {tagGroups.filter(tag => offers.some(p => p.tag === tag)).map(tag => (
              <div key={tag} style={{ marginBottom: 56 }}>
                <motion.div {...fadeUp}>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', marginBottom: 8 }}>
                    {tag === 'Sale' ? '🔥 SALE' : tag === 'Limited' ? '◈ LIMITED EDITION' : tag === 'New' ? '✦ NEW ARRIVAL' : tag.toUpperCase()}
                  </div>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobile ? 12 : 20 }}>
                  {offers.filter(p => p.tag === tag).map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                      <OfferCard product={p} onAdd={() => addItem('lava', p, (p.sizes||[])[1]||'M')} navigate={navigate} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
            {/* Products with no matching group tag */}
            {offers.filter(p => !tagGroups.includes(p.tag)).length > 0 && (
              <div style={{ marginBottom: 56 }}>
                <motion.div {...fadeUp}>
                  <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', marginBottom: 8 }}>FEATURED</div>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: mobile ? 12 : 20 }}>
                  {offers.filter(p => !tagGroups.includes(p.tag)).map((p, i) => (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                      <OfferCard product={p} onAdd={() => addItem('lava', p, (p.sizes||[])[1]||'M')} navigate={navigate} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <LavaFooter />
    </div>
  )
}
