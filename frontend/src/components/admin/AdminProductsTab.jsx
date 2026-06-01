import { useState, useEffect } from 'react'
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../../services/adminApi'

const LAVA_CATS = ['Tops', 'Slips', 'Sets', 'Outerwear']
const SOLO_CATS = ['Gown', 'Slip', 'Bodice', 'Suit', 'Dress', 'Sari']
const LAVA_TAGS = ['', 'Featured', 'New', 'Limited', 'Restock']
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL']

function emptyForm(brand) {
  if (brand === 'solo') {
    return { name: '', price: '', cat: 'Gown', code: '', process_time: '', fabric: '', product_desc: '', image_url: '', active: true }
  }
  return { name: '', price: '', cat: 'Tops', tag: '', sub: '', drop: '05', sizes: ['S', 'M', 'L'], story: '', details: '', care: '', fit: '', image_url: '', active: true }
}

function formFromProduct(p, brand) {
  if (brand === 'solo') {
    return { name: p.name || '', price: p.price || '', cat: p.cat || 'Gown', code: p.code || '', process_time: p.process_time || '', fabric: p.fabric || '', product_desc: p.product_desc || '', image_url: p.image_url || '', active: p.active !== false }
  }
  return { name: p.name || '', price: p.price || '', cat: p.cat || 'Tops', tag: p.tag || '', sub: p.sub || '', drop: p.drop || '05', sizes: p.sizes || [], story: p.story || '', details: p.details || '', care: p.care || '', fit: p.fit || '', image_url: p.image_url || '', active: p.active !== false }
}

export default function AdminProductsTab({ brand, accent, gradient }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm(brand))
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [error, setError] = useState('')

  const CATS = brand === 'solo' ? SOLO_CATS : LAVA_CATS

  useEffect(() => {
    load()
  }, [brand])

  const load = () => {
    setLoading(true)
    getAdminProducts(brand)
      .then(r => setProducts(r.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm(brand))
    setError('')
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditingId(p.id)
    setForm(formFromProduct(p, brand))
    setError('')
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const toggleSize = (s) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s)
        ? prev.sizes.filter(x => x !== s)
        : [...prev.sizes, s]
    }))
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.cat) { setError('Name, price, and category are required.'); return }
    setSaving(true); setError('')
    try {
      const payload = { ...form, brand, price: parseInt(form.price, 10) }
      if (editingId) {
        const r = await updateAdminProduct(editingId, payload)
        setProducts(prev => prev.map(p => p.id === editingId ? r.data : p))
      } else {
        const r = await createAdminProduct(payload)
        setProducts(prev => [r.data, ...prev])
      }
      closeForm()
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteAdminProduct(id)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch { setError('Failed to delete product.') }
    setDeleteId(null)
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)',
    border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 6, padding: '10px 14px',
    fontSize: 13, fontFamily: 'DM Sans', color: '#FAF8F5', outline: 'none',
  }

  const labelStyle = { fontSize: 10, letterSpacing: 1.5, color: 'rgba(250,248,245,0.45)', fontFamily: 'DM Sans', display: 'block', marginBottom: 6 }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, position: 'relative' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 4 }}>MANAGE</div>
          <div style={{ fontSize: 22, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5' }}>Products</div>
        </div>
        <button onClick={openAdd} style={{
          padding: '10px 22px', borderRadius: 6, border: 'none', cursor: 'pointer',
          background: gradient || accent, color: '#fff',
          fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 1.5,
        }}>
          + ADD PRODUCT
        </button>
      </div>

      {error && <div style={{ marginBottom: 16, fontSize: 12, color: '#E8906A', fontFamily: 'DM Sans' }}>{error}</div>}

      {/* Product list */}
      {loading ? (
        <div style={{ color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', fontSize: 13 }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans', fontSize: 13 }}>
          No products yet. Add your first one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map(p => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '64px 1fr auto',
              gap: 16, alignItems: 'center',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${p.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,0,0,0.15)'}`,
              borderRadius: 8, padding: '14px 16px',
              opacity: p.active ? 1 : 0.5,
            }}>
              {/* Thumbnail */}
              <div style={{
                width: 64, height: 64, borderRadius: 6, overflow: 'hidden',
                background: 'rgba(255,255,255,0.06)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {p.image_url
                  ? <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  : <span style={{ fontSize: 22, opacity: 0.3 }}>✦</span>
                }
              </div>

              {/* Info */}
              <div>
                <div style={{ fontFamily: 'DM Sans', fontSize: 14, fontWeight: 500, color: '#FAF8F5', marginBottom: 3 }}>
                  {p.name}
                  {p.tag && <span style={{ marginLeft: 8, fontSize: 9, letterSpacing: 1.5, color: accent, border: `1px solid ${accent}`, borderRadius: 999, padding: '2px 8px' }}>{p.tag.toUpperCase()}</span>}
                  {!p.active && <span style={{ marginLeft: 8, fontSize: 9, letterSpacing: 1.5, color: '#E8906A', border: '1px solid #E8906A', borderRadius: 999, padding: '2px 8px' }}>HIDDEN</span>}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans' }}>
                  {p.cat} · ₹{Number(p.price).toLocaleString()}
                  {brand === 'solo' && p.code && ` · ${p.code}`}
                  {brand === 'lava' && p.sizes?.length > 0 && ` · ${p.sizes.join(', ')}`}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(p)} style={{
                  padding: '7px 16px', borderRadius: 5, border: `1px solid rgba(255,255,255,0.15)`,
                  background: 'transparent', color: 'rgba(250,248,245,0.7)',
                  fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', letterSpacing: 0.5,
                }}>Edit</button>
                <button onClick={() => setDeleteId(p.id)} style={{
                  padding: '7px 12px', borderRadius: 5, border: '1px solid rgba(232,144,106,0.3)',
                  background: 'transparent', color: '#E8906A',
                  fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
                }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm overlay */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1A1410', borderRadius: 12, padding: '36px 40px', maxWidth: 360, width: '90%', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontStyle: 'italic', color: '#FAF8F5', marginBottom: 12 }}>Hide this product?</div>
            <div style={{ fontSize: 13, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', marginBottom: 28, lineHeight: 1.6 }}>
              The product will be hidden from the site but not permanently deleted.
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '10px 24px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(250,248,245,0.6)', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#E8906A', color: '#fff', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer', fontWeight: 600 }}>Hide Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Product form modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px' }}>
          <div style={{ background: '#1A1410', borderRadius: 12, padding: '36px 40px', width: '100%', maxWidth: 640, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontStyle: 'italic', color: '#FAF8F5' }}>
                {editingId ? 'Edit Product' : 'New Product'}
              </div>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'rgba(250,248,245,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Name + Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 14 }}>
                <div>
                  <label style={labelStyle}>PRODUCT NAME *</label>
                  <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. The Halo Slip" />
                </div>
                <div>
                  <label style={labelStyle}>PRICE (₹) *</label>
                  <input style={inputStyle} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="3499" />
                </div>
              </div>

              {/* Category */}
              <div style={{ display: 'grid', gridTemplateColumns: brand === 'solo' ? '1fr 1fr' : '1fr 1fr 80px', gap: 14 }}>
                <div>
                  <label style={labelStyle}>CATEGORY *</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.cat} onChange={e => set('cat', e.target.value)}>
                    {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {brand === 'solo' ? (
                  <div>
                    <label style={labelStyle}>CODE</label>
                    <input style={inputStyle} value={form.code} onChange={e => set('code', e.target.value)} placeholder="HC-01" />
                  </div>
                ) : (
                  <>
                    <div>
                      <label style={labelStyle}>TAG</label>
                      <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.tag} onChange={e => set('tag', e.target.value)}>
                        {LAVA_TAGS.map(t => <option key={t} value={t}>{t || '— none —'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>DROP</label>
                      <input style={inputStyle} value={form.drop} onChange={e => set('drop', e.target.value)} placeholder="05" />
                    </div>
                  </>
                )}
              </div>

              {/* Image URL */}
              <div>
                <label style={labelStyle}>IMAGE URL</label>
                <input style={inputStyle} value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
                {form.image_url && (
                  <div style={{ marginTop: 8, width: 80, height: 80, borderRadius: 6, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={form.image_url} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                  </div>
                )}
              </div>

              {/* Brand-specific fields */}
              {brand === 'solo' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>PROCESS TIME</label>
                      <input style={inputStyle} value={form.process_time} onChange={e => set('process_time', e.target.value)} placeholder="14–18 weeks" />
                    </div>
                    <div>
                      <label style={labelStyle}>FABRIC</label>
                      <input style={inputStyle} value={form.fabric} onChange={e => set('fabric', e.target.value)} placeholder="Silk charmeuse, cotton trim" />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>DESCRIPTION</label>
                    <textarea rows={4} style={{ ...inputStyle, resize: 'vertical' }} value={form.product_desc} onChange={e => set('product_desc', e.target.value)} placeholder="The full piece description..." />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label style={labelStyle}>SUBTITLE</label>
                    <input style={inputStyle} value={form.sub} onChange={e => set('sub', e.target.value)} placeholder="e.g. Bias-cut viscose, gradient dyed" />
                  </div>
                  <div>
                    <label style={labelStyle}>SIZES</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {ALL_SIZES.map(s => (
                        <button key={s} type="button" onClick={() => toggleSize(s)} style={{
                          width: 44, height: 36, borderRadius: 6, border: `1px solid ${form.sizes.includes(s) ? accent : 'rgba(255,255,255,0.15)'}`,
                          background: form.sizes.includes(s) ? `${accent}22` : 'transparent',
                          color: form.sizes.includes(s) ? accent : 'rgba(250,248,245,0.5)',
                          fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', fontWeight: 600,
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>STORY</label>
                    <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.story} onChange={e => set('story', e.target.value)} placeholder="Short editorial description..." />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={labelStyle}>DETAILS</label>
                      <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.details} onChange={e => set('details', e.target.value)} placeholder="Fabric composition, construction..." />
                    </div>
                    <div>
                      <label style={labelStyle}>CARE</label>
                      <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.care} onChange={e => set('care', e.target.value)} placeholder="Care instructions..." />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>FIT</label>
                    <input style={inputStyle} value={form.fit} onChange={e => set('fit', e.target.value)} placeholder="True to size. 32&quot; length from waist." />
                  </div>
                </>
              )}

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" onClick={() => set('active', !form.active)} style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: form.active ? accent : 'rgba(255,255,255,0.15)',
                  position: 'relative', transition: 'background 0.25s',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: 3, transition: 'left 0.25s',
                    left: form.active ? 23 : 3,
                  }} />
                </button>
                <span style={{ fontSize: 12, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans' }}>
                  {form.active ? 'Visible on site' : 'Hidden from site'}
                </span>
              </div>

              {error && <div style={{ fontSize: 12, color: '#E8906A', fontFamily: 'DM Sans' }}>{error}</div>}

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button onClick={closeForm} style={{ padding: '11px 24px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(250,248,245,0.6)', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '11px 28px', borderRadius: 6, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                  background: gradient || accent, color: '#fff', opacity: saving ? 0.7 : 1,
                  fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 1,
                }}>
                  {saving ? 'SAVING...' : editingId ? 'SAVE CHANGES' : 'ADD PRODUCT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
