import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductSilhouette from './ProductSilhouette'
import LavaGlass from './LavaGlass'

export default function CollectionCard({ product, onAdd }) {
  const [added, setAdded] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    setAdded(true)
    onAdd?.(product)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link to={`/lava/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <LavaGlass
        style={{
          overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          position: 'relative', height: 360
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-8px)'
          e.currentTarget.style.boxShadow = `0 24px 48px ${product.palette[0]}40`
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        {product.tag && (
          <div style={{
            position: 'absolute', top: 12, left: 12, zIndex: 2,
            background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: 10, fontWeight: 600,
            letterSpacing: 1.5, padding: '4px 10px', borderRadius: 999, fontFamily: 'DM Sans, sans-serif'
          }}>
            {product.tag.toUpperCase()}
          </div>
        )}
        <div style={{
          height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${product.palette[0]}30, ${product.palette[1]}20, ${product.palette[2]}30)`,
          position: 'relative'
        }}>
          <ProductSilhouette type={product.silhouette} palette={product.palette} width={100} height={160} />
        </div>
        <div style={{ padding: '16px 20px 20px' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, fontFamily: 'DM Sans', marginBottom: 4 }}>
            DROP {product.drop} · {product.cat.toUpperCase()}
          </div>
          <div style={{ fontSize: 16, fontWeight: 500, fontFamily: 'DM Sans', marginBottom: 2 }}>{product.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', marginBottom: 12 }}>{product.sub}</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 16, fontWeight: 600, fontFamily: 'DM Sans' }}>₹{product.price.toLocaleString()}</span>
            <button
              onClick={handleAdd}
              style={{
                padding: '8px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 1,
                background: added ? '#22c55e' : `linear-gradient(90deg, ${product.palette[0]}, ${product.palette[1]})`,
                color: '#fff', transition: 'background 0.3s ease'
              }}
            >
              {added ? '✓ ADDED' : 'ADD'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {product.palette.map((c, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: c, border: '1px solid rgba(255,255,255,0.3)' }} />
            ))}
          </div>
        </div>
      </LavaGlass>
    </Link>
  )
}
