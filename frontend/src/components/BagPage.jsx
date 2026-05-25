import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useMobile } from '../hooks/useMobile'

const GRAIN = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'

function SoloItem({ item, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '22px 0', borderBottom: '1px solid rgba(201,169,110,0.1)'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', marginBottom: 6 }}>
          {item.code} · {item.cat?.toUpperCase()}
        </div>
        <div style={{ fontSize: 18, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 4 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans', marginBottom: 2 }}>
          {item.size} · {item.fabric}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', marginTop: 4 }}>
          Timeline: {item.process}
        </div>
      </div>
      <div style={{ textAlign: 'right', marginLeft: 20, flexShrink: 0 }}>
        <div style={{ fontSize: 17, color: '#C9A96E', fontFamily: 'Cormorant Garamond', marginBottom: 12 }}>
          ₹{item.price.toLocaleString()}
        </div>
        <button
          onClick={() => onRemove(item.slug, item.size)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 10, letterSpacing: 1.5, color: 'rgba(250,248,245,0.25)',
            fontFamily: 'DM Sans', transition: 'color 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(250,248,245,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,248,245,0.25)'}
        >
          REMOVE
        </button>
      </div>
    </motion.div>
  )
}

function LavaItem({ item, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(169,144,204,0.7)', fontFamily: 'DM Sans', marginBottom: 6 }}>
          LAVA LAVA
        </div>
        <div style={{ fontSize: 17, fontFamily: 'DM Sans', fontWeight: 500, color: '#FAF8F5', marginBottom: 4 }}>
          {item.name}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.45)', fontFamily: 'DM Sans' }}>
          Size: {item.size} · Qty: {item.qty}
        </div>
      </div>
      <div style={{ textAlign: 'right', marginLeft: 20, flexShrink: 0 }}>
        <div style={{ fontSize: 16, color: '#A990CC', fontFamily: 'DM Sans', fontWeight: 600, marginBottom: 12 }}>
          ₹{(item.price * item.qty).toLocaleString()}
        </div>
        <button
          onClick={() => onRemove(item.slug, item.size)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 10, letterSpacing: 1.5, color: 'rgba(250,248,245,0.25)',
            fontFamily: 'DM Sans', transition: 'color 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(250,248,245,0.6)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(250,248,245,0.25)'}
        >
          REMOVE
        </button>
      </div>
    </motion.div>
  )
}

export default function BagPage() {
  const { cartItems, removeItem, cart } = useCart()
  const navigate = useNavigate()
  const mobile = useMobile()

  const soloItems = cartItems.filter(i => i.brand === 'solo')
  const lavaItems = cartItems.filter(i => i.brand === 'lava')
  const isEmpty = cartItems.length === 0

  const soloTotal = soloItems.reduce((sum, i) => sum + i.price * i.qty, 0)
  const lavaTotal = lavaItems.reduce((sum, i) => sum + i.price * i.qty, 0)

  const pad = mobile ? '24px' : '80px'

  return (
    <div style={{ background: '#201D1A', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />

      {/* Nav bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: mobile ? '14px 20px' : '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(32,29,26,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,169,110,0.1)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            color: 'rgba(201,169,110,0.7)', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          ←
        </button>
        <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: mobile ? 18 : 22, fontWeight: 300, color: '#FAF8F5' }}>
          Your Bag
        </span>
        <span style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans' }}>
          {cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'}
        </span>
      </div>

      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>

        {/* Empty state */}
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ padding: `80px ${pad}`, textAlign: 'center' }}
          >
            <div style={{ fontSize: 40, marginBottom: 24, opacity: 0.3 }}>◇</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, fontSize: 32, marginBottom: 16, color: 'rgba(250,248,245,0.6)' }}>
              Your bag is empty.
            </h2>
            <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'rgba(250,248,245,0.35)', lineHeight: 1.8, marginBottom: 40 }}>
              Add a bespoke commission from Solo Sarto,<br />or discover ready-to-wear from Lava Lava.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/solo/collection')} style={{
                padding: '13px 28px', borderRadius: 2, cursor: 'pointer',
                border: '1px solid rgba(201,169,110,0.4)', background: 'transparent',
                color: '#C9A96E', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 2
              }}>
                SOLO SARTO
              </button>
              <button onClick={() => navigate('/lava/collection')} style={{
                padding: '13px 28px', borderRadius: 999, cursor: 'pointer',
                border: 'none', background: 'linear-gradient(90deg, #E8906A, #8B6FB8)',
                color: '#fff', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 2, fontWeight: 600
              }}>
                LAVA LAVA
              </button>
            </div>
          </motion.div>
        )}

        {/* Items */}
        {!isEmpty && (
          <div style={{ padding: mobile ? '32px 24px 80px' : '48px 80px 100px', display: 'grid', gridTemplateColumns: mobile ? '1fr' : soloItems.length && lavaItems.length ? '1fr 1fr' : '1fr', gap: mobile ? 48 : 80, maxWidth: 1100, margin: '0 auto' }}>

            {/* Solo Sarto section */}
            {soloItems.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 4 }}>SOLO SARTO</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, fontSize: 28, marginBottom: 4, color: '#FAF8F5' }}>
                  Your Commission
                </h2>
                <p style={{ fontSize: 12, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 28, lineHeight: 1.7 }}>
                  Prices are indicative and confirmed after consultation.
                </p>

                <div>
                  {soloItems.map(item => (
                    <SoloItem key={`${item.slug}-${item.size}`} item={item} onRemove={removeItem} />
                  ))}
                </div>

                {/* Solo summary */}
                <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(201,169,110,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2, color: 'rgba(250,248,245,0.4)' }}>ESTIMATED TOTAL</span>
                    <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, color: '#C9A96E' }}>₹{soloTotal.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => navigate('/solo/contact')}
                    style={{
                      width: '100%', padding: '15px', borderRadius: 2, border: 'none', cursor: 'pointer',
                      background: '#C9A96E', color: '#1A1A1A',
                      fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2
                    }}
                  >
                    REQUEST CONSULTATION
                  </button>
                  <p style={{ fontSize: 11, color: 'rgba(250,248,245,0.2)', fontFamily: 'DM Sans', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
                    All commissions begin with a personal consultation.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Lava Lava section */}
            {lavaItems.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(232,144,106,0.08), rgba(139,111,184,0.08))',
                  border: '1px solid rgba(139,111,184,0.2)',
                  borderRadius: 4, padding: mobile ? '24px 20px' : '32px 28px'
                }}>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#A990CC', fontFamily: 'DM Sans', marginBottom: 4 }}>LAVA LAVA</div>
                  <h2 style={{ fontFamily: 'DM Sans', fontWeight: 600, fontSize: 22, marginBottom: 24, color: '#FAF8F5' }}>
                    Your Bag
                  </h2>

                  <div>
                    {lavaItems.map(item => (
                      <LavaItem key={`${item.slug}-${item.size}`} item={item} onRemove={removeItem} />
                    ))}
                  </div>

                  {/* Lava summary */}
                  <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                      <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2, color: 'rgba(250,248,245,0.4)' }}>SUBTOTAL</span>
                      <span style={{ fontFamily: 'DM Sans', fontSize: 20, fontWeight: 600, color: '#A990CC' }}>₹{lavaTotal.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => navigate('/lava/contact')}
                      style={{
                        width: '100%', padding: '15px', borderRadius: 999, border: 'none', cursor: 'pointer',
                        background: 'linear-gradient(90deg, #E8906A, #D96A8A, #8B6FB8)',
                        color: '#fff', fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2
                      }}
                    >
                      CHECKOUT
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
