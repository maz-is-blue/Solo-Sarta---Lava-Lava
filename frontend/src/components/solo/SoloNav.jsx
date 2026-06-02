import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useCart } from '../../context/CartContext'
import { useMobile } from '../../hooks/useMobile'
import { useLanguage } from '../../context/LanguageContext'

function BagIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="rgba(201,169,110,0.85)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

function LangToggle({ lang, setLang, t }) {
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
      style={{
        background: 'rgba(201,169,110,0.1)',
        border: '1px solid rgba(201,169,110,0.35)',
        borderRadius: 2, padding: '4px 11px', cursor: 'pointer',
        fontSize: 11, fontFamily: lang === 'ar' ? 'Cairo, DM Sans, sans-serif' : 'DM Sans, sans-serif',
        fontWeight: 600, color: '#C9A96E', letterSpacing: 0.5,
        transition: 'background 0.2s ease', flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,169,110,0.2)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(201,169,110,0.1)'}
    >
      {t('lang_label')}
    </button>
  )
}

export default function SoloNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const { cart } = useCart()
  const mobile = useMobile()
  const { lang, setLang, isRTL, t } = useLanguage()

  const NAV_LINKS = [
    { label: t('solo_atelier'), path: '/solo' },
    { label: t('solo_collection'), path: '/solo/collection' },
    { label: t('solo_story'), path: '/solo/story' },
    { label: t('solo_contact'), path: '/solo/contact' },
  ]

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: mobile ? '14px 20px' : '18px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(42,36,32,0.92)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(201,169,110,0.12)'
      }}>

        {/* LEFT: back + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 20, flexShrink: 0 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              color: 'rgba(201,169,110,0.6)', fontSize: mobile ? 18 : 14,
              lineHeight: 1, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'DM Sans', letterSpacing: 1, transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#C9A96E'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(201,169,110,0.6)'}
          >
            {t('back_arrow')} {!mobile && <span style={{ fontSize: 10, letterSpacing: 2 }}>{t('back_home')}</span>}
          </button>

          <div onClick={() => navigate('/solo')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <img
              src={`${import.meta.env.BASE_URL}assets/solo-logo-nav.png`}
              alt="Solo Sarto"
              style={{ height: mobile ? 34 : 54, width: 'auto', objectFit: 'contain', filter: 'brightness(0) saturate(100%) invert(65%) sepia(39%) saturate(590%) hue-rotate(335deg) brightness(105%)' }}
            />
            <span className="font-lock" style={{ fontWeight: 300, fontSize: mobile ? 12 : 15, letterSpacing: 1, color: '#E8956D', whiteSpace: 'nowrap', lineHeight: 1 }}>
              by Shiyam
            </span>
          </div>
        </div>

        {/* Desktop RIGHT: nav links + lang + bag */}
        {!mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {NAV_LINKS.map(({ label, path }) => {
              const active = pathname === path
              return (
                <span key={path} onClick={() => navigate(path)} style={{
                  fontSize: 13, letterSpacing: 2, fontFamily: 'DM Sans', cursor: 'pointer',
                  color: active ? '#C9A96E' : 'rgba(250,248,245,0.7)',
                  borderBottom: active ? '1px solid rgba(201,169,110,0.55)' : '1px solid transparent',
                  paddingBottom: 2, transition: 'color 0.2s ease'
                }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#C9A96E' }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(250,248,245,0.7)' }}
                >
                  {label.toUpperCase()}
                </span>
              )
            })}

            <LangToggle lang={lang} setLang={setLang} t={t} />

            <div
              onClick={() => navigate('/bag')}
              style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <BagIcon />
              {cart.solo > 0 && (
                <div style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#C9A96E', color: '#1A1A1A',
                  fontSize: 9, fontWeight: 700, fontFamily: 'DM Sans',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cart.solo}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile: lang + bag + hamburger */}
        {mobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <LangToggle lang={lang} setLang={setLang} t={t} />

            <div style={{ position: 'relative', cursor: 'pointer', display: 'flex' }} onClick={() => navigate('/bag')}>
              <BagIcon />
              {cart.solo > 0 && (
                <div style={{
                  position: 'absolute', top: -5, right: -5,
                  width: 15, height: 15, borderRadius: '50%',
                  background: '#C9A96E', color: '#1A1A1A',
                  fontSize: 8, fontWeight: 700, fontFamily: 'DM Sans',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cart.solo}
                </div>
              )}
            </div>

            <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'rgba(201,169,110,0.8)', borderRadius: 1 }} />
              <span style={{ display: 'block', width: 15, height: 1.5, background: 'rgba(201,169,110,0.8)', borderRadius: 1 }} />
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'rgba(201,169,110,0.8)', borderRadius: 1 }} />
            </button>
          </div>
        )}
      </nav>

      {/* Mobile sidebar */}
      {mobile && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.65)',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'all' : 'none',
              transition: 'opacity 0.3s ease'
            }}
          />

          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 0, bottom: 0, zIndex: 201,
            [isRTL ? 'left' : 'right']: 0,
            width: 270,
            background: '#2A2420',
            [isRTL ? 'borderRight' : 'borderLeft']: '1px solid rgba(201,169,110,0.18)',
            transform: open ? 'translateX(0)' : isRTL ? 'translateX(-100%)' : 'translateX(100%)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 22px 28px' }}>
              <span style={{ fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 19, color: '#C9A96E', fontWeight: 300 }}>Solo Sarto</span>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(250,248,245,0.5)', fontSize: 20, padding: 4, lineHeight: 1, display: 'flex' }}>✕</button>
            </div>

            {NAV_LINKS.map(({ label, path }) => {
              const active = pathname === path
              return (
                <div key={path} onClick={() => navigate(path)} style={{
                  padding: '17px 22px',
                  borderTop: '1px solid rgba(201,169,110,0.08)',
                  cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  background: active ? 'rgba(201,169,110,0.06)' : 'transparent'
                }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2.5, color: active ? '#C9A96E' : 'rgba(250,248,245,0.7)' }}>
                    {label.toUpperCase()}
                  </span>
                  <span style={{ color: active ? '#C9A96E' : 'rgba(250,248,245,0.2)', fontSize: 12 }}>{isRTL ? '←' : '→'}</span>
                </div>
              )
            })}

            <div style={{ flex: 1 }} />

            <div style={{ borderTop: '1px solid rgba(201,169,110,0.12)', padding: '20px 22px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.solo > 0 && (
                <div onClick={() => navigate('/bag')} style={{
                  background: '#C9A96E', borderRadius: 2, padding: '12px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
                  marginBottom: 4
                }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2, fontWeight: 600, color: '#1A1A1A' }}>{t('view_bag')}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, color: '#1A1A1A' }}>{cart.solo}</span>
                </div>
              )}
              <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ color: 'rgba(201,169,110,0.5)', fontSize: 14 }}>{t('back_arrow')}</span>
                <span style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: 2, color: 'rgba(250,248,245,0.35)' }}>{t('back_to_home')}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
