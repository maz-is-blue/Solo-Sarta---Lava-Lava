import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useMobile } from '../../hooks/useMobile'
import { motion } from 'framer-motion'
import LavaNav from './LavaNav'
import LavaFooter from './LavaFooter'
import LavaGlass from '../shared/LavaGlass'
import ProductSilhouette from '../shared/ProductSilhouette'
import CollectionCard from '../shared/CollectionCard'
import { getProduct, getProducts } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../context/LanguageContext'

function Accordion({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 0', background: 'none', border: 'none', cursor: 'pointer',
          color: '#fff', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500, letterSpacing: 0.5
        }}
      >
        {title}
        <span style={{ fontSize: 18, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 16, fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function LavaProduct() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [allProducts, setAllProducts] = useState([])
  const [loadingProduct, setLoadingProduct] = useState(true)

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const mobile = useMobile()
  const { lang, t } = useLanguage()

  useEffect(() => {
    setLoadingProduct(true)
    getProduct(slug)
      .then(r => setProduct(r.data))
      .catch(() => setProduct(null))
      .finally(() => setLoadingProduct(false))
    getProducts({ brand: 'lava' }).then(r => setAllProducts(r.data)).catch(() => {})
  }, [slug])

  const related = useMemo(() => {
    if (!product) return []
    const same = allProducts.filter(p => p.cat === product.cat && p.slug !== product.slug)
    const rest = allProducts.filter(p => p.slug !== product.slug && !same.includes(p))
    return [...same, ...rest].slice(0, 4)
  }, [product, allProducts])

  if (loadingProduct) {
    return (
      <div style={{ background: 'linear-gradient(180deg, #0f0018 0%, #050010 100%)', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LavaNav />
      </div>
    )
  }

  if (!product) {
    return (
      <div style={{ background: 'linear-gradient(180deg, #0f0018 0%, #050010 100%)', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LavaNav />
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: 40, fontStyle: 'italic', marginBottom: 16 }}>Product not found</h2>
          <Link to="/lava/collection" style={{ color: '#D99AB4', fontFamily: 'DM Sans', fontSize: 14 }}>← Back to Collection</Link>
        </div>
      </div>
    )
  }

  const handleAdd = () => {
    if (!selectedSize) return
    addItem('lava', product, selectedSize, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  const installment = Math.round(product.price / 3)
  const palette = product.palette?.length ? product.palette : ['#E8906A', '#D96A8A', '#8B6FB8']
  const sizes = product.sizes || []

  return (
    <div style={{ background: 'linear-gradient(180deg, #0f0018 0%, #050010 100%)', minHeight: '100vh', color: '#fff' }}>
      <LavaNav />

      <section style={{ paddingTop: mobile ? 90 : 120, paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, paddingBottom: mobile ? 48 : 80 }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 32, letterSpacing: 0.5 }}>
          <Link to="/lava/collection" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Collection</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>{product.cat}</span>
          <span style={{ margin: '0 8px' }}>›</span>
          <span style={{ color: '#fff' }}>{product.name}</span>
        </div>

        {/* layout */}
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 32 : 64, alignItems: 'start' }}>
          {/* Left: Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <LavaGlass style={{ overflow: 'hidden', marginBottom: 20 }}>
              <div style={{
                height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                background: `linear-gradient(135deg, ${palette[0]}25, ${palette[1]}15, ${palette[2]}25)`
              }}>
                <div style={{
                  position: 'absolute', width: 280, height: 280, borderRadius: '50%',
                  background: `radial-gradient(circle, ${palette[selectedColor]}50, transparent 70%)`,
                  filter: 'blur(50px)'
                }} />
                {product.image_url
                  ? <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                  : <ProductSilhouette type={product.silhouette} palette={palette} width={200} height={320} />
                }
                {product.tag && (
                  <div style={{
                    position: 'absolute', top: 20, left: 20,
                    background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 10, fontWeight: 600,
                    letterSpacing: 1.5, padding: '5px 12px', borderRadius: 999, fontFamily: 'DM Sans'
                  }}>
                    {product.tag.toUpperCase()}
                  </div>
                )}
              </div>
            </LavaGlass>
            {/* Color thumbnails */}
            <div style={{ display: 'flex', gap: 12 }}>
              {palette.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(i)}
                  style={{
                    flex: 1, height: 72, borderRadius: 12, border: selectedColor === i ? `2px solid ${c}` : '2px solid transparent',
                    background: `linear-gradient(135deg, ${c}60, ${palette[(i+1)%3]}40)`,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    boxShadow: selectedColor === i ? `0 4px 16px ${c}60` : 'none'
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            {/* Category badge */}
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: 999,
              background: `linear-gradient(90deg, ${palette[0]}30, ${palette[1]}20)`,
              border: `1px solid ${palette[0]}40`,
              fontSize: 11, letterSpacing: 1.5, color: palette[0], fontFamily: 'DM Sans', marginBottom: 16
            }}>
              {product.cat.toUpperCase()} · DROP {product.drop}
            </div>

            <h1 style={{ fontSize: 48, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400, marginBottom: 8 }}>
              {(lang === 'ar' && product.name_ar) ? product.name_ar : product.name}
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', marginBottom: 24 }}>
              {(lang === 'ar' && product.sub_ar) ? product.sub_ar : product.sub}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 32, fontWeight: 600, fontFamily: 'DM Sans' }}>₹{product.price.toLocaleString()}</span>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 28 }}>
              or 3 installments of ₹{installment.toLocaleString()}
            </p>

            {/* Story */}
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', fontFamily: 'DM Sans', lineHeight: 1.8, marginBottom: 28 }}>
              {(lang === 'ar' && product.story_ar) ? product.story_ar : product.story}
            </p>

            {/* Color swatches */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>{t('colorway')}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {palette.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    style={{
                      width: 28, height: 28, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                      boxShadow: selectedColor === i ? `0 0 0 3px rgba(255,255,255,0.15), 0 0 0 2px ${c}` : 'none',
                      transition: 'box-shadow 0.2s'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>
                {t('size_label')} {selectedSize && `— ${selectedSize}`}
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    style={{
                      width: 48, height: 48, borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: selectedSize === s
                        ? `linear-gradient(90deg, ${palette[0]}, ${palette[1]})`
                        : 'rgba(255,255,255,0.08)',
                      color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedSize === s ? `0 4px 16px ${palette[0]}50` : 'none'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans', marginTop: 8 }}>
                {(lang === 'ar' && product.fit_ar) ? product.fit_ar : product.fit}
              </div>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>{t('quantity')}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontSize: 18, fontFamily: 'DM Sans', minWidth: 24, textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', background: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>

            {/* Add to Bag */}
            <button
              onClick={handleAdd}
              disabled={!selectedSize}
              style={{
                width: '100%', padding: '16px', borderRadius: 16, border: 'none', cursor: selectedSize ? 'pointer' : 'not-allowed',
                background: added
                  ? '#22c55e'
                  : selectedSize
                    ? `linear-gradient(90deg, ${palette[0]}, ${palette[1]}, ${palette[2]})`
                    : 'rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 1.5,
                transition: 'all 0.3s ease',
                boxShadow: selectedSize && !added ? `0 8px 32px ${palette[0]}40` : 'none',
                marginBottom: 16
              }}
            >
              {added ? t('added_to_bag') : selectedSize ? t('add_to_bag_btn') : t('select_size')}
            </button>

            {/* Shipping info */}
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 28, display: 'flex', gap: 16 }}>
              <span>✦ Free shipping on orders over ₹3,000</span>
              <span>✦ Easy 14-day returns</span>
            </div>

            {/* Accordions */}
            <Accordion title={t('tab_details')}>
              <p>{(lang === 'ar' && product.details_ar) ? product.details_ar : product.details}</p>
            </Accordion>
            <Accordion title={t('tab_care')}>
              <p>{(lang === 'ar' && product.care_ar) ? product.care_ar : product.care}</p>
            </Accordion>
            <Accordion title={t('tab_shipping')}>
              <p>Free standard shipping within India. Estimated 3–5 business days. Returns accepted within 14 days of delivery. Items must be unworn and untagged.</p>
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, paddingBottom: mobile ? 48 : 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 40 }}
          >
            <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 8 }}>COMPLETE THE LOOK</div>
            <h2 style={{ fontSize: 36, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400 }}>You might also like</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? 12 : 24 }}>
            {related.map(p => (
              <CollectionCard key={p.id} product={p} onAdd={prod => addItem('lava', prod, prod.sizes[1])} />
            ))}
          </div>
        </section>
      )}

      <LavaFooter />
    </div>
  )
}
