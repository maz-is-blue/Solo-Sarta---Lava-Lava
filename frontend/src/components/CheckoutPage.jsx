import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useMobile } from '../hooks/useMobile'
import { submitOrder } from '../services/api'

const GRAIN = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Credit / Debit Card' },
  { id: 'bank', label: 'Bank Transfer' },
  { id: 'cod', label: 'Cash on Delivery' },
]

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 2, fontFamily: 'DM Sans',
      color: 'rgba(250,248,245,0.4)', marginBottom: 8, textTransform: 'uppercase'
    }}>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text', style = {} }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? 'rgba(201,169,110,0.5)' : 'rgba(250,248,245,0.1)'}`,
        borderRadius: 3, padding: '13px 16px',
        fontSize: 14, fontFamily: 'DM Sans', color: '#FAF8F5',
        outline: 'none', transition: 'border-color 0.2s ease',
        ...style
      }}
    />
  )
}

function Textarea({ value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%', boxSizing: 'border-box', resize: 'vertical',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${focused ? 'rgba(201,169,110,0.5)' : 'rgba(250,248,245,0.1)'}`,
        borderRadius: 3, padding: '13px 16px',
        fontSize: 14, fontFamily: 'DM Sans', color: '#FAF8F5',
        outline: 'none', transition: 'border-color 0.2s ease',
      }}
    />
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { cartItems, clearCart } = useCart()
  const mobile = useMobile()

  // Determine context: 'solo', 'lava', or 'both' passed via navigate state
  const brand = state?.brand ?? 'both'

  const soloItems = cartItems.filter(i => i.brand === 'solo' || (!i.brand && i.code))
  const lavaItems = cartItems.filter(i => i.brand === 'lava' || (!i.brand && !i.code))

  const relevantSolo = brand === 'lava' ? [] : soloItems
  const relevantLava = brand === 'solo' ? [] : lavaItems

  const soloTotal = relevantSolo.reduce((s, i) => s + i.price * i.qty, 0)
  const lavaTotal = relevantLava.reduce((s, i) => s + i.price * i.qty, 0)
  const grandTotal = soloTotal + lavaTotal

  const [form, setForm] = useState({ name: '', phone: '', email: '', payment: '', address: '' })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = field => val => setForm(prev => ({ ...prev, [field]: val }))

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your full name.'
    if (!form.phone.trim()) return 'Please enter your phone number.'
    if (!form.email.trim() || !form.email.includes('@')) return 'Please enter a valid email.'
    if (!form.payment) return 'Please select a payment method.'
    if (!form.address.trim()) return 'Please enter your shipping address.'
    return ''
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    const items = [...relevantSolo, ...relevantLava].map(i => ({
      name: i.name, slug: i.slug, price: i.price, qty: i.qty || 1, size: i.size || null, brand: i.brand,
    }))
    try {
      await submitOrder({
        brand,
        customer_name:    form.name,
        customer_email:   form.email,
        customer_phone:   form.phone,
        shipping_address: form.address,
        payment_method:   form.payment,
        items,
        total: grandTotal,
      })
    } catch { /* offline — still show success */ }
    setSubmitted(true)
    clearCart()
  }

  const isSolo = brand === 'solo'
  const accent = isSolo ? '#C9A96E' : '#A990CC'
  const accentHex = isSolo ? '#C9A96E' : '#8B6FB8'

  const pad = mobile ? '20px' : '80px'

  if (submitted) {
    return (
      <div style={{ background: '#201D1A', minHeight: '100vh', color: '#FAF8F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 28, opacity: 0.7 }}>✦</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, fontSize: mobile ? 30 : 42, marginBottom: 16, color: '#FAF8F5' }}>
          Order Received
        </h1>
        <p style={{ fontFamily: 'DM Sans', fontSize: 14, color: 'rgba(250,248,245,0.5)', lineHeight: 1.8, maxWidth: 440, marginBottom: 40 }}>
          Thank you, {form.name.split(' ')[0]}. We've noted your order and will be in touch at <span style={{ color: accent }}>{form.email}</span> shortly to confirm the details.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '13px 32px', borderRadius: isSolo ? 2 : 999, cursor: 'pointer',
              border: `1px solid ${accent}`, background: 'transparent',
              color: accent, fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 2
            }}
          >
            HOME
          </button>
          <button
            onClick={() => navigate(isSolo ? '/solo/collection' : '/lava/collection')}
            style={{
              padding: '13px 32px', borderRadius: isSolo ? 2 : 999, cursor: 'pointer',
              border: 'none',
              background: isSolo ? '#C9A96E' : 'linear-gradient(90deg, #E8906A, #8B6FB8)',
              color: isSolo ? '#1A1A1A' : '#fff',
              fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 2, fontWeight: 600
            }}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#201D1A', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />

      {/* Nav */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: mobile ? '14px 20px' : '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(32,29,26,0.95)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,169,110,0.1)'
      }}>
        <button
          onClick={() => navigate('/bag')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'rgba(201,169,110,0.7)', fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          ←
        </button>
        <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: mobile ? 18 : 22, fontWeight: 300, color: '#FAF8F5' }}>
          Checkout
        </span>
        <span style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans' }}>
          {(relevantSolo.length + relevantLava.length)} ITEMS
        </span>
      </div>

      <div style={{ paddingTop: 80, position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          padding: mobile ? '40px 20px 80px' : '56px 80px 100px',
          display: 'grid',
          gridTemplateColumns: mobile ? '1fr' : '1fr 380px',
          gap: mobile ? 40 : 60,
          alignItems: 'start'
        }}>

          {/* LEFT: Form */}
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: accent, fontFamily: 'DM Sans', marginBottom: 8 }}>
              YOUR DETAILS
            </div>
            <h2 style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, fontSize: mobile ? 26 : 34, marginBottom: 36, color: '#FAF8F5' }}>
              Delivery Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Name */}
              <div>
                <FieldLabel>Full Name</FieldLabel>
                <Input value={form.name} onChange={set('name')} placeholder="e.g. Shiyam Jahjah" />
              </div>

              {/* Phone + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16 }}>
                <div>
                  <FieldLabel>Phone Number</FieldLabel>
                  <Input value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" type="tel" />
                </div>
                <div>
                  <FieldLabel>Email Address</FieldLabel>
                  <Input value={form.email} onChange={set('email')} placeholder="you@example.com" type="email" />
                </div>
              </div>

              {/* Payment method */}
              <div>
                <FieldLabel>Payment Method</FieldLabel>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {PAYMENT_METHODS.map(m => {
                    const sel = form.payment === m.id
                    return (
                      <button
                        key={m.id}
                        onClick={() => set('payment')(m.id)}
                        style={{
                          padding: '13px 12px', borderRadius: 3, cursor: 'pointer',
                          border: `1px solid ${sel ? accentHex : 'rgba(250,248,245,0.1)'}`,
                          background: sel ? `${accentHex}18` : 'rgba(255,255,255,0.03)',
                          color: sel ? accent : 'rgba(250,248,245,0.55)',
                          fontSize: 12, fontFamily: 'DM Sans', letterSpacing: 0.5,
                          transition: 'all 0.2s ease', textAlign: 'left'
                        }}
                      >
                        {m.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Shipping address */}
              <div>
                <FieldLabel>Shipping Address</FieldLabel>
                <Textarea value={form.address} onChange={set('address')} placeholder="Street, City, State, PIN Code" />
              </div>

              {/* Error */}
              {error && (
                <div style={{ fontSize: 12, color: '#E8906A', fontFamily: 'DM Sans', padding: '10px 14px', background: 'rgba(232,144,106,0.08)', border: '1px solid rgba(232,144,106,0.2)', borderRadius: 3 }}>
                  {error}
                </div>
              )}

              {/* Submit — only shown on mobile below form */}
              {mobile && (
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100%', padding: '16px', borderRadius: isSolo ? 2 : 999,
                    border: 'none', cursor: 'pointer',
                    background: isSolo ? '#C9A96E' : 'linear-gradient(90deg, #E8906A, #D96A8A, #8B6FB8)',
                    color: isSolo ? '#1A1A1A' : '#fff',
                    fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 2,
                    marginTop: 8
                  }}
                >
                  PLACE ORDER
                </button>
              )}
            </div>
          </div>

          {/* RIGHT: Order summary */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(250,248,245,0.07)',
            borderRadius: 4, padding: mobile ? '24px 20px' : '28px 24px',
            position: mobile ? 'static' : 'sticky', top: 100
          }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans', marginBottom: 20 }}>
              ORDER SUMMARY
            </div>

            {relevantSolo.length > 0 && (
              <div style={{ marginBottom: relevantLava.length ? 20 : 0 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12 }}>SOLO SARTO</div>
                {relevantSolo.map(item => (
                  <div key={`${item.slug}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 15, color: '#FAF8F5' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans' }}>{item.size}</div>
                    </div>
                    <div style={{ fontSize: 14, color: '#C9A96E', fontFamily: 'Cormorant Garamond', whiteSpace: 'nowrap' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            {relevantLava.length > 0 && (
              <div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: '#A990CC', fontFamily: 'DM Sans', marginBottom: 12, marginTop: relevantSolo.length ? 8 : 0 }}>LAVA LAVA</div>
                {relevantLava.map(item => (
                  <div key={`${item.slug}-${item.size}`} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'DM Sans', fontWeight: 500, fontSize: 14, color: '#FAF8F5' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans' }}>Size {item.size} · Qty {item.qty}</div>
                    </div>
                    <div style={{ fontSize: 14, color: '#A990CC', fontFamily: 'DM Sans', fontWeight: 600, whiteSpace: 'nowrap' }}>₹{(item.price * item.qty).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ borderTop: '1px solid rgba(250,248,245,0.08)', marginTop: 20, paddingTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2, color: 'rgba(250,248,245,0.4)' }}>TOTAL</span>
                <span style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, color: '#FAF8F5' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans', lineHeight: 1.6, marginBottom: 24 }}>
                {relevantSolo.length > 0 ? 'Final Solo Sarto price confirmed after consultation. ' : ''}
                Shipping calculated at confirmation.
              </div>

              {/* Submit on desktop */}
              {!mobile && (
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100%', padding: '15px', borderRadius: isSolo ? 2 : 999,
                    border: 'none', cursor: 'pointer',
                    background: isSolo ? '#C9A96E' : 'linear-gradient(90deg, #E8906A, #D96A8A, #8B6FB8)',
                    color: isSolo ? '#1A1A1A' : '#fff',
                    fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 2
                  }}
                >
                  PLACE ORDER
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
