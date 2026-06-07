import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminContent, bulkUpdateContent } from '../../services/adminApi'
import { useMobile } from '../../hooks/useMobile'
import AdminProductsTab from './AdminProductsTab'
import AdminOrdersTab from './AdminOrdersTab'
import AdminVideosTab from './AdminVideosTab'

const SECTIONS = [
  { key: 'home',       label: 'Home Page' },
  { key: 'story',      label: 'Our Story' },
  { key: 'contact',    label: 'Contact' },
  { key: 'collection', label: 'Collection' },
  { key: 'landing',    label: 'Landing Page' },
]

const ACCENT = '#C9A96E'

function BilingualField({ item, enValue, arValue, onEnChange, onArChange }) {
  const isTextarea = item.type === 'textarea'
  const enBase = {
    width: '100%', boxSizing: 'border-box',
    background: 'rgba(201,169,110,0.05)',
    border: '1px solid rgba(201,169,110,0.15)',
    borderRadius: 3, padding: '11px 14px',
    fontSize: 13, fontFamily: 'DM Sans', color: '#FAF8F5',
    outline: 'none', resize: 'vertical',
  }
  const arBase = {
    ...enBase,
    direction: 'rtl', fontFamily: 'Cairo, DM Sans, sans-serif',
    background: 'rgba(201,169,110,0.03)',
    border: '1px solid rgba(201,169,110,0.1)',
  }
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans', marginBottom: 8 }}>{item.label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 1, color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans', marginBottom: 4 }}>EN</div>
          {isTextarea
            ? <textarea rows={3} value={enValue} onChange={e => onEnChange(item.id, e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.15)'}
                style={enBase} />
            : <input type="text" value={enValue} onChange={e => onEnChange(item.id, e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.15)'}
                style={enBase} />
          }
        </div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: 1, color: 'rgba(250,248,245,0.25)', fontFamily: 'DM Sans', marginBottom: 4, textAlign: 'right' }}>عربي</div>
          {isTextarea
            ? <textarea rows={3} value={arValue} onChange={e => onArChange(`${item.section}.${item.key}`, e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.1)'}
                placeholder="النص العربي..."
                style={arBase} />
            : <input type="text" value={arValue} onChange={e => onArChange(`${item.section}.${item.key}`, e.target.value)}
                onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.1)'}
                placeholder="النص العربي..."
                style={arBase} />
          }
        </div>
      </div>
    </div>
  )
}

export default function SoloAdminDashboard() {
  const navigate = useNavigate()
  const mobile = useMobile()
  const [activeTab, setActiveTab] = useState('content')
  const [activeSection, setActiveSection] = useState('home')
  const [allItems, setAllItems] = useState([])
  const [edits, setEdits] = useState({})
  const [arEdits, setArEdits] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('ss_admin_token')
    if (!token) { navigate('/admin/login'); return }
    getAdminContent('solo')
      .then(res => {
        setAllItems(res.data)
        const enMap = {}, arMap = {}
        res.data.forEach(i => {
          if (i.lang === 'ar') arMap[`${i.section}.${i.key}`] = i.value
          else enMap[i.id] = i.value
        })
        setEdits(enMap)
        setArEdits(arMap)
      })
      .catch(() => navigate('/admin/login'))
  }, [])

  const enSectionItems = allItems.filter(i => i.section === activeSection && i.lang !== 'ar')
  const handleChange = (id, value) => setEdits(prev => ({ ...prev, [id]: value }))
  const handleArChange = (sectionKey, value) => setArEdits(prev => ({ ...prev, [sectionKey]: value }))

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const enUpdates = enSectionItems.map(i => ({ id: i.id, value: edits[i.id] ?? i.value }))
      const arUpdates = enSectionItems.flatMap(i => {
        const val = arEdits[`${i.section}.${i.key}`]
        if (!val && val !== '') return []
        const existing = allItems.find(x => x.lang === 'ar' && x.section === i.section && x.key === i.key)
        if (existing) return [{ id: existing.id, value: val }]
        return [{ brand: 'solo', section: i.section, key: i.key, lang: 'ar', value: val, label: i.label, type: i.type }]
      })
      await bulkUpdateContent([...enUpdates, ...arUpdates])
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch { setError('Failed to save. Please try again.') }
    finally { setSaving(false) }
  }

  const logout = () => {
    localStorage.removeItem('ss_admin_token')
    navigate('/admin/login')
  }

  const SIDEBAR_W = 220

  const tabBtn = (tab, label) => (
    <button onClick={() => { setActiveTab(tab); setSidebarOpen(false) }} style={{
      flex: 1, padding: '8px 4px', background: activeTab === tab ? 'rgba(201,169,110,0.15)' : 'transparent',
      border: 'none', borderBottom: `2px solid ${activeTab === tab ? ACCENT : 'transparent'}`,
      cursor: 'pointer', fontSize: 9, letterSpacing: 1.5, fontFamily: 'DM Sans',
      color: activeTab === tab ? ACCENT : 'rgba(250,248,245,0.4)', transition: 'all 0.2s',
    }}>{label}</button>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#141009', fontFamily: 'DM Sans', color: '#FAF8F5' }}>

      {/* Sidebar */}
      {(!mobile || sidebarOpen) && (
        <>
          {mobile && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 199 }} />}
          <div style={{
            width: SIDEBAR_W, flexShrink: 0, background: '#1A1410',
            borderRight: '1px solid rgba(201,169,110,0.1)',
            display: 'flex', flexDirection: 'column',
            position: mobile ? 'fixed' : 'sticky',
            top: 0, left: 0, height: '100vh', zIndex: 200, overflowY: 'auto',
          }}>
            {/* Brand header */}
            <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(201,169,110,0.5)', marginBottom: 8 }}>ADMIN</div>
              <div style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: ACCENT }}>Solo Sarto</div>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              {tabBtn('content', 'CONTENT')}
              {tabBtn('products', 'PRODUCTS')}
              {tabBtn('orders', 'ORDERS')}
              {tabBtn('videos', 'VIDEOS')}
            </div>

            {/* Sub-nav for content tab */}
            {activeTab === 'content' && (
              <nav style={{ flex: 1, padding: '12px 0' }}>
                {SECTIONS.map(s => (
                  <button key={s.key} onClick={() => { setActiveSection(s.key); setSidebarOpen(false) }} style={{
                    width: '100%', textAlign: 'left', padding: '11px 20px',
                    background: activeSection === s.key ? 'rgba(201,169,110,0.1)' : 'transparent',
                    border: 'none', cursor: 'pointer',
                    borderLeft: `2px solid ${activeSection === s.key ? ACCENT : 'transparent'}`,
                    fontSize: 11, letterSpacing: 1.5,
                    color: activeSection === s.key ? ACCENT : 'rgba(250,248,245,0.5)',
                    transition: 'all 0.2s',
                  }}>
                    {s.label.toUpperCase()}
                  </button>
                ))}
              </nav>
            )}

            <div style={{ flex: activeTab !== 'content' ? 1 : 0 }} />

            {/* Bottom */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(201,169,110,0.1)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => navigate('/admin/lava')} style={{
                background: 'linear-gradient(90deg, rgba(232,144,106,0.15), rgba(139,111,184,0.15))',
                border: '1px solid rgba(139,111,184,0.2)', borderRadius: 999,
                padding: '9px 14px', cursor: 'pointer', fontSize: 10, letterSpacing: 1.5, color: '#A990CC',
              }}>→ LAVA LAVA</button>
              <button onClick={() => window.open('/#/solo', '_blank')} style={{
                background: 'transparent', border: '1px solid rgba(201,169,110,0.15)',
                borderRadius: 3, padding: '9px 14px', cursor: 'pointer',
                fontSize: 10, letterSpacing: 1.5, color: 'rgba(201,169,110,0.5)',
              }}>VIEW SITE ↗</button>
              <button onClick={logout} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 10, letterSpacing: 1.5, color: 'rgba(250,248,245,0.2)',
                padding: '6px 0', textAlign: 'left',
              }}>SIGN OUT</button>
            </div>
          </div>
        </>
      )}

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Top bar */}
        <div style={{
          padding: mobile ? '14px 20px' : '18px 40px',
          borderBottom: '1px solid rgba(201,169,110,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: '#1A1410', position: 'sticky', top: 0, zIndex: 50,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {mobile && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ACCENT, fontSize: 18, padding: 0 }}>☰</button>
            )}
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(201,169,110,0.5)', marginBottom: 2 }}>
                {activeTab === 'content' ? 'EDITING' : activeTab === 'products' ? 'MANAGING' : activeTab === 'videos' ? 'MANAGING' : 'TRACKING'}
              </div>
              <div style={{ fontSize: 16, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5' }}>
                {activeTab === 'content' ? SECTIONS.find(s => s.key === activeSection)?.label
                  : activeTab === 'products' ? 'Products'
                  : activeTab === 'videos' ? 'Hero Videos'
                  : 'Orders'}
              </div>
            </div>
          </div>

          {activeTab === 'content' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {saved && <span style={{ fontSize: 11, color: ACCENT, letterSpacing: 1 }}>✓ SAVED</span>}
              {error && <span style={{ fontSize: 11, color: '#E8906A' }}>{error}</span>}
              <button onClick={handleSave} disabled={saving} style={{
                padding: '10px 24px', borderRadius: 3, border: 'none', cursor: 'pointer',
                background: saving ? 'rgba(201,169,110,0.4)' : ACCENT,
                color: '#1A1A1A', fontSize: 10, fontWeight: 700, letterSpacing: 2,
              }}>
                {saving ? 'SAVING...' : 'SAVE CHANGES'}
              </button>
            </div>
          )}
        </div>

        {/* Content area */}
        {activeTab === 'content' && (
          <div style={{ flex: 1, padding: mobile ? '28px 20px' : '36px 48px', maxWidth: 1100 }}>
            {enSectionItems.length === 0 && <div style={{ color: 'rgba(250,248,245,0.3)', fontSize: 13 }}>Loading content...</div>}
            {enSectionItems.map(item => (
              <BilingualField
                key={item.id}
                item={item}
                enValue={edits[item.id] ?? item.value}
                arValue={arEdits[`${item.section}.${item.key}`] ?? ''}
                onEnChange={handleChange}
                onArChange={handleArChange}
              />
            ))}
          </div>
        )}

        {activeTab === 'products' && (
          <AdminProductsTab brand="solo" accent={ACCENT} />
        )}

        {activeTab === 'orders' && (
          <AdminOrdersTab brand="solo" accent={ACCENT} />
        )}

        {activeTab === 'videos' && (
          <AdminVideosTab brand="solo" accent={ACCENT} />
        )}
      </div>
    </div>
  )
}
