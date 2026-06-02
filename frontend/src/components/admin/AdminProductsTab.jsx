import { useState, useEffect, useRef, useCallback } from 'react'
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct, uploadMedia } from '../../services/adminApi'

const LAVA_TAGS = ['', 'Featured', 'New', 'Limited', 'Restock']
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL']

function emptyForm(brand) {
  if (brand === 'solo') {
    return { name: '', price: '', cat: '', code: '', process_time: '', fabric: '', product_desc: '', product_desc_ar: '', name_ar: '', images: [], active: true }
  }
  return { name: '', price: '', cat: '', tag: '', sub: '', sub_ar: '', drop: '05', sizes: ['S', 'M', 'L'], story: '', story_ar: '', details: '', details_ar: '', care: '', care_ar: '', fit: '', fit_ar: '', name_ar: '', images: [], active: true }
}

function formFromProduct(p, brand) {
  const images = p.images?.length ? p.images : (p.image_url ? [p.image_url] : [])
  if (brand === 'solo') {
    return { name: p.name || '', price: p.price || '', cat: p.cat || '', code: p.code || '', process_time: p.process_time || '', fabric: p.fabric || '', product_desc: p.product_desc || '', product_desc_ar: p.product_desc_ar || '', name_ar: p.name_ar || '', images, active: p.active !== false }
  }
  return { name: p.name || '', price: p.price || '', cat: p.cat || '', tag: p.tag || '', sub: p.sub || '', sub_ar: p.sub_ar || '', drop: p.drop || '05', sizes: p.sizes || [], story: p.story || '', story_ar: p.story_ar || '', details: p.details || '', details_ar: p.details_ar || '', care: p.care || '', care_ar: p.care_ar || '', fit: p.fit || '', fit_ar: p.fit_ar || '', name_ar: p.name_ar || '', images, active: p.active !== false }
}

function ImageUploader({ images, onChange, accent, uploading, onUpload }) {
  const fileRef = useRef(null)
  const [urlInput, setUrlInput] = useState('')

  const addUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    onChange([...images, url])
    setUrlInput('')
  }

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx))

  const moveFirst = (idx) => {
    if (idx === 0) return
    const next = [...images]
    const [item] = next.splice(idx, 1)
    next.unshift(item)
    onChange(next)
  }

  return (
    <div>
      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
          {images.map((url, idx) => (
            <div key={idx} style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 90, height: 90, borderRadius: 8, overflow: 'hidden',
                border: `2px solid ${idx === 0 ? accent : 'rgba(255,255,255,0.12)'}`,
              }}>
                <img
                  src={url} alt=""
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.background = '#333'; e.target.style.display = 'none' }}
                />
              </div>
              {idx === 0 && (
                <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, letterSpacing: 1, background: accent, color: '#1A1A1A', padding: '2px 5px', borderRadius: 3, fontFamily: 'DM Sans', fontWeight: 700 }}>MAIN</div>
              )}
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => moveFirst(idx)}
                  title="Set as main image"
                  style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 8, letterSpacing: 1, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '2px 5px', borderRadius: 3, border: 'none', cursor: 'pointer', fontFamily: 'DM Sans' }}
                >
                  SET MAIN
                </button>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                style={{
                  position: 'absolute', top: -7, right: -7,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#E8906A', border: 'none', color: '#fff',
                  fontSize: 10, cursor: 'pointer', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Upload + URL controls */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* File upload button */}
        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '9px 18px', borderRadius: 6, cursor: uploading ? 'not-allowed' : 'pointer',
          border: `1px solid ${accent}`, color: accent,
          fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 0.5,
          opacity: uploading ? 0.6 : 1, background: 'transparent', whiteSpace: 'nowrap',
        }}>
          {uploading ? 'Uploading...' : '+ Upload from device'}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            style={{ display: 'none' }}
            onChange={onUpload}
          />
        </label>

        {/* URL paste */}
        <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 220 }}>
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
            placeholder="or paste image URL..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
              padding: '9px 12px', fontSize: 13, fontFamily: 'DM Sans',
              color: '#FAF8F5', outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={addUrl}
            style={{
              padding: '9px 16px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: 'rgba(250,248,245,0.6)',
              fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer',
            }}
          >Add</button>
        </div>
      </div>
      <div style={{ marginTop: 6, fontSize: 10, color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans' }}>
        First image is the main display image. Click SET MAIN to reorder.
      </div>
    </div>
  )
}

function ArabicSection({ brand, form, set, inputStyle, labelStyle }) {
  const [open, setOpen] = useState(false)
  const arStyle = { ...inputStyle, direction: 'rtl', fontFamily: 'Cairo, DM Sans, sans-serif' }
  const arLabelStyle = { ...labelStyle, direction: 'rtl', textAlign: 'right', fontFamily: 'Cairo, DM Sans, sans-serif', fontSize: 11 }

  return (
    <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer',
          color: 'rgba(250,248,245,0.6)', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 1.5,
        }}
      >
        <span>ARABIC / عربي</span>
        <span style={{ fontSize: 16, transition: 'transform 0.2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', color: 'rgba(250,248,245,0.4)' }}>+</span>
      </button>

      {open && (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(255,255,255,0.02)' }}>
          <div>
            <label style={arLabelStyle}>اسم المنتج</label>
            <input style={arStyle} value={form.name_ar} onChange={e => set('name_ar', e.target.value)} placeholder="الاسم بالعربية" />
          </div>

          {brand === 'solo' ? (
            <div>
              <label style={arLabelStyle}>الوصف</label>
              <textarea rows={3} style={{ ...arStyle, resize: 'vertical' }} value={form.product_desc_ar} onChange={e => set('product_desc_ar', e.target.value)} placeholder="الوصف بالعربية..." />
            </div>
          ) : (
            <>
              <div>
                <label style={arLabelStyle}>العنوان الفرعي</label>
                <input style={arStyle} value={form.sub_ar} onChange={e => set('sub_ar', e.target.value)} placeholder="مثل: قماش فيسكوز مائل" />
              </div>
              <div>
                <label style={arLabelStyle}>القصة</label>
                <textarea rows={2} style={{ ...arStyle, resize: 'vertical' }} value={form.story_ar} onChange={e => set('story_ar', e.target.value)} placeholder="وصف تحريري..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={arLabelStyle}>التفاصيل</label>
                  <textarea rows={2} style={{ ...arStyle, resize: 'vertical' }} value={form.details_ar} onChange={e => set('details_ar', e.target.value)} placeholder="مواصفات القماش..." />
                </div>
                <div>
                  <label style={arLabelStyle}>العناية</label>
                  <textarea rows={2} style={{ ...arStyle, resize: 'vertical' }} value={form.care_ar} onChange={e => set('care_ar', e.target.value)} placeholder="تعليمات العناية..." />
                </div>
              </div>
              <div>
                <label style={arLabelStyle}>المقاس</label>
                <input style={arStyle} value={form.fit_ar} onChange={e => set('fit_ar', e.target.value)} placeholder='مناسب للمقاس الأصلي' />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminProductsTab({ brand, accent, gradient }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm(brand))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [brand])

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
      sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s]
    }))
  }

  const handleFilesUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      const urls = await Promise.all(files.map(f => uploadMedia(f).then(r => r.data.url)))
      set('images', [...form.images, ...urls])
    } catch {
      setError('Upload failed. Check file size (max 8 MB each).')
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.cat.trim()) {
      setError('Name, price, and category are required.')
      return
    }
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
    } catch { setError('Failed to hide product.') }
    setDeleteId(null)
  }

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, padding: '10px 14px',
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

      {error && !showForm && <div style={{ marginBottom: 16, fontSize: 12, color: '#E8906A', fontFamily: 'DM Sans' }}>{error}</div>}

      {/* Product list */}
      {loading ? (
        <div style={{ color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', fontSize: 13 }}>Loading products...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans', fontSize: 13 }}>
          No products yet. Add your first one.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {products.map(p => {
            const thumb = p.images?.[0] || p.image_url
            return (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '72px 1fr auto',
                gap: 16, alignItems: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${p.active ? 'rgba(255,255,255,0.08)' : 'rgba(255,0,0,0.15)'}`,
                borderRadius: 8, padding: '14px 16px',
                opacity: p.active ? 1 : 0.5,
              }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 6, overflow: 'hidden',
                  background: 'rgba(255,255,255,0.06)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {thumb
                    ? <img src={thumb} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none' }} />
                    : <span style={{ fontSize: 22, opacity: 0.3 }}>✦</span>
                  }
                </div>

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
                    {p.images?.length > 1 && ` · ${p.images.length} photos`}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => openEdit(p)} style={{
                    padding: '7px 16px', borderRadius: 5, border: '1px solid rgba(255,255,255,0.15)',
                    background: 'transparent', color: 'rgba(250,248,245,0.7)',
                    fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
                  }}>Edit</button>
                  <button onClick={() => setDeleteId(p.id)} style={{
                    padding: '7px 12px', borderRadius: 5, border: '1px solid rgba(232,144,106,0.3)',
                    background: 'transparent', color: '#E8906A',
                    fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
                  }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Delete confirm */}
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.78)', zIndex: 500, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 20px' }}>
          <div style={{ background: '#1A1410', borderRadius: 12, padding: '36px 40px', width: '100%', maxWidth: 660, border: '1px solid rgba(255,255,255,0.1)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
              <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 24, fontStyle: 'italic', color: '#FAF8F5' }}>
                {editingId ? 'Edit Product' : 'New Product'}
              </div>
              <button onClick={closeForm} style={{ background: 'none', border: 'none', color: 'rgba(250,248,245,0.4)', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

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

              {/* Category (free text) + brand-specific meta */}
              <div style={{ display: 'grid', gridTemplateColumns: brand === 'solo' ? '1fr 1fr' : '1fr 1fr 80px', gap: 14 }}>
                <div>
                  <label style={labelStyle}>CATEGORY *</label>
                  <input
                    style={inputStyle}
                    value={form.cat}
                    onChange={e => set('cat', e.target.value)}
                    placeholder={brand === 'solo' ? 'e.g. Gown, Suit, Sari...' : 'e.g. Tops, Slips, Sets...'}
                  />
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

              {/* Images */}
              <div>
                <label style={labelStyle}>IMAGES</label>
                <ImageUploader
                  images={form.images}
                  onChange={imgs => set('images', imgs)}
                  accent={accent}
                  uploading={uploading}
                  onUpload={handleFilesUpload}
                />
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
                          width: 44, height: 36, borderRadius: 6,
                          border: `1px solid ${form.sizes.includes(s) ? accent : 'rgba(255,255,255,0.15)'}`,
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
                      <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.details} onChange={e => set('details', e.target.value)} placeholder="Fabric composition..." />
                    </div>
                    <div>
                      <label style={labelStyle}>CARE</label>
                      <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} value={form.care} onChange={e => set('care', e.target.value)} placeholder="Care instructions..." />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>FIT</label>
                    <input style={inputStyle} value={form.fit} onChange={e => set('fit', e.target.value)} placeholder='True to size. 32" length from waist.' />
                  </div>
                </>
              )}

              {/* Arabic fields */}
              <ArabicSection brand={brand} form={form} set={set} inputStyle={inputStyle} labelStyle={labelStyle} />

              {/* Active toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button type="button" onClick={() => set('active', !form.active)} style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: form.active ? accent : 'rgba(255,255,255,0.15)',
                  position: 'relative', transition: 'background 0.25s', flexShrink: 0,
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
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 4 }}>
                <button onClick={closeForm} style={{ padding: '11px 24px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(250,248,245,0.6)', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} disabled={saving || uploading} style={{
                  padding: '11px 28px', borderRadius: 6, border: 'none',
                  cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                  background: gradient || accent, color: '#fff',
                  opacity: (saving || uploading) ? 0.7 : 1,
                  fontSize: 12, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 1,
                }}>
                  {saving ? 'SAVING...' : uploading ? 'UPLOADING...' : editingId ? 'SAVE CHANGES' : 'ADD PRODUCT'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}
