import { useState, useEffect } from 'react'
import { getAdminOrders, updateAdminOrder } from '../../services/adminApi'

const STATUSES = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending:    { bg: 'rgba(201,169,110,0.15)', color: '#C9A96E' },
  confirmed:  { bg: 'rgba(100,160,255,0.15)', color: '#7AADFF' },
  processing: { bg: 'rgba(232,144,106,0.15)', color: '#E8906A' },
  shipped:    { bg: 'rgba(169,144,204,0.15)', color: '#A990CC' },
  delivered:  { bg: 'rgba(80,200,120,0.15)',  color: '#50C878' },
  cancelled:  { bg: 'rgba(220,80,80,0.15)',   color: '#E05050' },
}

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff' }
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: 9, letterSpacing: 1.5, fontFamily: 'DM Sans', fontWeight: 700,
      padding: '4px 10px', borderRadius: 999,
    }}>
      {status.toUpperCase()}
    </span>
  )
}

function OrderRow({ order, accent, onUpdated }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState(order.status)
  const [notes, setNotes] = useState(order.admin_notes || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const r = await updateAdminOrder(order.id, { status, admin_notes: notes })
      onUpdated(r.data)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const total = Number(order.total)

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden', marginBottom: 10 }}>
      {/* Row header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'grid',
          gridTemplateColumns: '120px 1fr 100px 100px 90px 28px',
          gap: 12, alignItems: 'center', padding: '14px 16px',
          background: open ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
          border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: accent, fontWeight: 600 }}>{order.order_number}</span>
        <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#FAF8F5' }}>{order.customer_name}</span>
        <span style={{ fontFamily: 'DM Sans', fontSize: 12, color: 'rgba(250,248,245,0.45)' }}>
          {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
        </span>
        <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#FAF8F5', fontWeight: 500 }}>₹{total.toLocaleString()}</span>
        <StatusBadge status={order.status} />
        <span style={{ color: 'rgba(250,248,245,0.4)', fontSize: 16, transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>⌄</span>
      </button>

      {/* Expanded detail */}
      {open && (
        <div style={{ padding: '20px 20px 24px', background: 'rgba(0,0,0,0.15)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Customer info */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 12 }}>CUSTOMER</div>
              {[
                ['Name',    order.customer_name],
                ['Email',   order.customer_email],
                ['Phone',   order.customer_phone],
                ['Payment', order.payment_method?.toUpperCase()],
                ['Address', order.shipping_address],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginRight: 8 }}>{k}:</span>
                  <span style={{ fontSize: 13, color: '#FAF8F5', fontFamily: 'DM Sans' }}>{v}</span>
                </div>
              ))}
            </div>
            {/* Items */}
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 12 }}>ORDER ITEMS</div>
              {(order.items || []).map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#FAF8F5', fontFamily: 'DM Sans' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans' }}>
                      {item.size && `Size ${item.size}`}{item.qty > 1 && ` · Qty ${item.qty}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: accent, fontFamily: 'DM Sans', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    ₹{(item.price * (item.qty || 1)).toLocaleString()}
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans' }}>TOTAL</span>
                <span style={{ fontSize: 16, color: '#FAF8F5', fontFamily: 'DM Sans', fontWeight: 600 }}>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status + notes update */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 180 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 6 }}>UPDATE STATUS</div>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '9px 12px', fontSize: 12, fontFamily: 'DM Sans', color: '#FAF8F5', outline: 'none', cursor: 'pointer', width: '100%' }}
              >
                {STATUSES.filter(s => s !== 'all').map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 6 }}>NOTES</div>
              <input
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Internal note..."
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '9px 12px', fontSize: 12, fontFamily: 'DM Sans', color: '#FAF8F5', outline: 'none' }}
              />
            </div>
            <button onClick={handleSave} disabled={saving} style={{
              padding: '9px 22px', borderRadius: 6, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              background: accent, color: '#1A1A1A',
              fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 1,
              opacity: saving ? 0.7 : 1, flexShrink: 0,
            }}>
              {saving ? 'SAVING...' : 'UPDATE'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersTab({ brand, accent }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [brand, statusFilter])

  const load = () => {
    setLoading(true)
    getAdminOrders({ brand, status: statusFilter })
      .then(r => setOrders(r.data.data || []))
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }

  const handleUpdated = (updated) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o))
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 4 }}>TRACK</div>
        <div style={{ fontSize: 22, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 20 }}>Orders</div>

        {/* Status filter */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{
              padding: '6px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 10, letterSpacing: 1.5, fontFamily: 'DM Sans', fontWeight: 600,
              background: statusFilter === s ? accent : 'rgba(255,255,255,0.07)',
              color: statusFilter === s ? '#1A1A1A' : 'rgba(250,248,245,0.5)',
            }}>
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 100px 100px 90px 28px', gap: 12, padding: '0 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 12 }}>
        {['ORDER NO.', 'CUSTOMER', 'DATE', 'TOTAL', 'STATUS', ''].map(h => (
          <span key={h} style={{ fontSize: 9, letterSpacing: 1.5, color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans' }}>{h}</span>
        ))}
      </div>

      {error && <div style={{ color: '#E8906A', fontSize: 12, fontFamily: 'DM Sans', marginBottom: 16 }}>{error}</div>}

      {loading ? (
        <div style={{ color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', fontSize: 13, padding: '40px 0' }}>Loading orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans', fontSize: 13 }}>
          No orders yet.
        </div>
      ) : (
        orders.map(order => (
          <OrderRow key={order.id} order={order} accent={accent} onUpdated={handleUpdated} />
        ))
      )}
    </div>
  )
}
