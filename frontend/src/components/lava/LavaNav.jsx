import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import LavaWordmark from '../shared/LavaWordmark'
import { useCart } from '../../context/CartContext'
import { useMobile } from '../../hooks/useMobile'
import { useLanguage } from '../../context/LanguageContext'
import { LAVA_CATS } from '../../constants/lavaCategories'

function BagIcon({ color = 'rgba(255,255,255,0.9)' }) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.35)',
        borderRadius: 999, padding: '4px 11px', cursor: 'pointer',
        fontSize: 11, fontFamily: lang === 'ar' ? 'Cairo, DM Sans, sans-serif' : 'DM Sans, sans-serif',
        fontWeight: 600, color: '#fff', letterSpacing: 0.5,
        transition: 'background 0.2s ease', flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
    >
      {t('lang_label')}
    </button>
  )
}

export default function LavaNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileCollOpen, setMobileCollOpen] = useState(false)
  const closeTimer = useRef(null)

  const { cart } = useCart()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const mobile = useMobile()
  const { lang, setLang, isRTL, t } = useLanguage()

  const NAV_LINKS = [
    { label: 'OFFERS', path: '/lava/offers', highlight: true },
    { label: t('lava_story'), path: '/lava/story' },
    { label: t('lava_contact'), path: '/lava/contact' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false); setMobileCollOpen(false) }, [pathname])

  const openDrop = () => { clearTimeout(closeTimer.current); setDropOpen(true) }
  const closeDrop = () => { closeTimer.current = setTimeout(() => setDropOpen(false), 150) }

  const goTo = (cat, sub = null) => {
    const qs = cat ? `?cat=${encodeURIComponent(cat)}${sub ? `&sub=${encodeURIComponent(sub)}` : ''}` : ''
    navigate(`/lava/collection${qs}`)
    setDropOpen(false)
    setOpen(false)
  }

  const isCollectionActive = pathname.startsWith('/lava/collection')

  const linkStyle = (active) => ({
    color: active ? '#fff' : 'rgba(255,255,255,0.8)',
    fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500, letterSpacing: 2,
    textTransform: 'uppercase', cursor: 'pointer',
    borderBottom: active ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
    paddingBottom: 2, transition: 'color 0.2s ease',
  })

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: mobile ? '12px 20px' : '14px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.2)',
        transition: 'all 0.4s ease'
      }}>
        {/* LEFT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 10 : 20, flexShrink: 0 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.85)',
              cursor: 'pointer', fontSize: mobile ? 12 : 13, fontFamily: 'DM Sans', fontWeight: 500,
              letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6, padding: 0,
              flexShrink: 0, transition: 'color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
          >
            {t('back_arrow')} {!mobile && <span style={{ fontSize: 10, letterSpacing: 2 }}>{t('back_home')}</span>}
          </button>
          <div onClick={() => navigate('/lava')} style={{ cursor: 'pointer' }}>
            <LavaWordmark size={mobile ? 20 : 32} />
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 12 : 32 }}>

          {/* Desktop: Collection with dropdown */}
          {!mobile && (
            <div onMouseEnter={openDrop} onMouseLeave={closeDrop}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span
                onClick={() => goTo(null)}
                style={linkStyle(isCollectionActive)}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = isCollectionActive ? '#fff' : 'rgba(255,255,255,0.8)'}
              >
                {t('lava_collection').toUpperCase()}
              </span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 1, pointerEvents: 'none' }}>▾</span>
            </div>
          )}

          {/* Desktop: other links */}
          {!mobile && NAV_LINKS.map(({ label, path, highlight }) => {
            const active = pathname === path
            if (highlight) return (
              <span key={path} onClick={() => navigate(path)}
                style={{
                  ...linkStyle(active),
                  background: 'linear-gradient(90deg,#E8906A,#D96A8A,#8B6FB8)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  borderBottom: active ? '1px solid #D96A8A' : '1px solid transparent',
                  fontWeight: 700,
                }}
              >
                {label}
              </span>
            )
            return (
              <span key={path} onClick={() => navigate(path)}
                style={linkStyle(active)}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = active ? '#fff' : 'rgba(255,255,255,0.8)'}
              >
                {label.toUpperCase()}
              </span>
            )
          })}

          {!mobile && <LangToggle lang={lang} setLang={setLang} t={t} />}

          {!mobile && (
            <div onClick={() => navigate('/bag')} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <BagIcon />
              {cart.lava > 0 && (
                <div style={{ position: 'absolute', top: -6, right: -6, width: 16, height: 16, borderRadius: '50%', background: '#fff', color: '#8B6FB8', fontSize: 9, fontWeight: 700, fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {cart.lava}
                </div>
              )}
            </div>
          )}

          {/* Mobile controls */}
          {mobile && (
            <>
              <LangToggle lang={lang} setLang={setLang} t={t} />
              <div style={{ position: 'relative', cursor: 'pointer', display: 'flex' }} onClick={() => navigate('/bag')}>
                <BagIcon />
                {cart.lava > 0 && (
                  <div style={{ position: 'absolute', top: -5, right: -5, width: 15, height: 15, borderRadius: '50%', background: '#fff', color: '#8B6FB8', fontSize: 8, fontWeight: 700, fontFamily: 'DM Sans', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {cart.lava}
                  </div>
                )}
              </div>
              <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
                <span style={{ display: 'block', width: 22, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 15, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 22, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 1 }} />
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Desktop mega-dropdown */}
      {dropOpen && !mobile && (
        <div
          onMouseEnter={openDrop}
          onMouseLeave={closeDrop}
          style={{
            position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
            background: 'rgba(10, 0, 22, 0.97)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '32px 80px 40px',
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <span
              onClick={() => goTo(null)}
              style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >
              VIEW ALL PIECES
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 56 }}>
            {Object.entries(LAVA_CATS).map(([cat, subs]) => (
              <div key={cat}>
                <div
                  onClick={() => goTo(cat)}
                  style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: 2.5, fontFamily: 'DM Sans',
                    color: '#fff', cursor: 'pointer', marginBottom: 16,
                    paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#D99AB4'}
                  onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                >
                  {cat.toUpperCase()}
                </div>
                {subs.map(sub => (
                  <div
                    key={sub}
                    onClick={() => goTo(cat, sub)}
                    style={{
                      fontSize: 13, fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.5)',
                      marginBottom: 12, cursor: 'pointer', paddingLeft: 2, transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile sidebar */}
      {mobile && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', opacity: open ? 1 : 0, pointerEvents: open ? 'all' : 'none', transition: 'opacity 0.3s ease' }} />

          <div style={{
            position: 'fixed', top: 0, bottom: 0, zIndex: 201,
            [isRTL ? 'left' : 'right']: 0, width: 280,
            background: 'linear-gradient(160deg, #3a1a2e, #1e1030)',
            [isRTL ? 'borderRight' : 'borderLeft']: '1px solid rgba(255,255,255,0.12)',
            transform: open ? 'translateX(0)' : isRTL ? 'translateX(-100%)' : 'translateX(100%)',
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
            display: 'flex', flexDirection: 'column', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 22px 20px' }}>
              <LavaWordmark size={22} />
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 20, padding: 4, lineHeight: 1 }}>✕</button>
            </div>

            {/* Collection expandable */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div
                onClick={() => setMobileCollOpen(o => !o)}
                style={{ padding: '17px 22px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isCollectionActive ? 'rgba(255,255,255,0.06)' : 'transparent' }}
              >
                <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2.5, color: isCollectionActive ? '#fff' : 'rgba(255,255,255,0.65)' }}>
                  {t('lava_collection').toUpperCase()}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, display: 'inline-block', transition: 'transform 0.2s', transform: mobileCollOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
              </div>

              {mobileCollOpen && (
                <div style={{ paddingBottom: 8 }}>
                  <div onClick={() => goTo(null)} style={{ padding: '9px 22px 9px 32px', cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)' }}>
                    ALL PIECES
                  </div>
                  {Object.entries(LAVA_CATS).map(([cat, subs]) => (
                    <div key={cat}>
                      <div
                        onClick={() => goTo(cat)}
                        style={{ padding: '10px 22px 6px 32px', cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,0.8)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                      >
                        {cat.toUpperCase()}
                      </div>
                      {subs.map(sub => (
                        <div
                          key={sub}
                          onClick={() => goTo(cat, sub)}
                          style={{ padding: '7px 22px 7px 44px', cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans', color: 'rgba(255,255,255,0.45)' }}
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {NAV_LINKS.map(({ label, path, highlight }) => {
              const active = pathname === path
              return (
                <div key={path} onClick={() => navigate(path)} style={{ padding: '17px 22px', borderTop: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: active ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                  <span style={{
                    fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2.5,
                    color: highlight ? 'transparent' : active ? '#fff' : 'rgba(255,255,255,0.65)',
                    background: highlight ? 'linear-gradient(90deg,#E8906A,#D96A8A,#8B6FB8)' : 'none',
                    WebkitBackgroundClip: highlight ? 'text' : 'unset',
                    WebkitTextFillColor: highlight ? 'transparent' : 'unset',
                    fontWeight: highlight ? 700 : 500,
                  }}>
                    {label}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>{isRTL ? '←' : '→'}</span>
                </div>
              )
            })}

            <div style={{ flex: 1 }} />

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '20px 22px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.lava > 0 && (
                <div onClick={() => navigate('/bag')} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 999, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 4 }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, letterSpacing: 2, fontWeight: 600, color: '#8B6FB8' }}>{t('view_bag')}</span>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, color: '#8B6FB8' }}>{cart.lava}</span>
                </div>
              )}
              <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>{t('back_arrow')}</span>
                <span style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.3)' }}>{t('back_to_home')}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
