import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LavaNav from './LavaNav'
import LavaFooter from './LavaFooter'
import LavaGlass from '../shared/LavaGlass'
import ProductSilhouette from '../shared/ProductSilhouette'
import { useMobile } from '../../hooks/useMobile'
import { useContent } from '../../context/ContentContext'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } }

const TIMELINE = [
  { year: '2018', title: 'Solo Sarto opens its doors', body: 'Bespoke couture for those who know. Eleven master tailors. A private atelier in Mumbai.' },
  { year: '2021', title: 'The first riot', body: 'A collection too colorful for couture, too careful for fast fashion. We put it away. Then we didn\'t.' },
  { year: '2024', title: 'Lava Lava is born', body: 'The diffusion line drops. Drop 01. Color, louder. Sold out in 72 hours. We knew.' },
  { year: '2026', title: 'Drop 04 · Solar Bloom', body: '12 pieces. 200–400 editions each. Sell out in 48h. The world is catching up to the feeling.' },
]

const PILLARS = [
  { icon: '✦', title: 'Color is a verb', body: 'We start with the palette. Every season, we pick five colors that feel like a feeling. The garments follow.' },
  { icon: '◈', title: 'Drape over decoration', body: 'Fabric first. Always. We spend more time on the hand of a cloth than on any embellishment.' },
  { icon: '◉', title: 'Slow at the seam', body: '12 pieces per drop. 200–400 editions. We make less. We mean it more.' },
]

export default function LavaStory() {
  const navigate = useNavigate()
  const mobile = useMobile()
  const { get } = useContent()

  return (
    <div style={{ background: 'linear-gradient(180deg, #0f0018 0%, #050010 100%)', minHeight: '100vh', color: '#fff' }}>
      <LavaNav />

      {/* Hero */}
      <section style={{ paddingTop: mobile ? 110 : 160, paddingBottom: mobile ? 48 : 80, paddingLeft: mobile ? 20 : 80, paddingRight: mobile ? 20 : 80, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', width: 700, height: 500, top: 0, right: -100, pointerEvents: 'none',
          background: 'radial-gradient(ellipse, rgba(232,144,106,0.18) 0%, rgba(139,111,184,0.12) 50%, transparent 80%)',
          filter: 'blur(80px)'
        }} />
        <motion.div {...fadeUp} style={{ maxWidth: 720, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 20 }}>{get('lava.story.eyebrow', 'OUR STORY')}</div>
          <h1 style={{ fontSize: 68, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>
            {get('lava.story.headline', 'Born backstage, raised on color.')}
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', fontFamily: 'DM Sans', fontWeight: 300, lineHeight: 1.8 }}>
            {get('lava.story.intro', "Lava Lava is a diffusion line born from Solo Sarto — a private atelier of 11 master tailors. We took what we couldn't show on the couture floor and gave it its own stage.")}
          </p>
        </motion.div>
      </section>

      {/* About */}
      <section style={{ padding: mobile ? '0 20px 48px' : '0 80px 80px', display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 32 : 64, alignItems: 'center' }}>
        <motion.div {...fadeUp}>
          <LavaGlass style={{ padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div style={{
              width: 240, height: 240, borderRadius: '50%', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(232,144,106,0.15), rgba(139,111,184,0.1))'
            }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,154,180,0.3), transparent 70%)', filter: 'blur(20px)' }} />
              <ProductSilhouette type="slip" palette={['#E8906A', '#D99AB4', '#8B6FB8']} width={140} height={220} />
            </div>
            <div style={{ marginTop: 24, textAlign: 'center' }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 8 }}>SOLAR BLOOM · DROP 04</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans' }}>12 pieces · 200–400 editions each</div>
            </div>
          </LavaGlass>
        </motion.div>
        <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 20 }}>{get('lava.story.brand_code_label', 'THE BRAND CODE')}</div>
          <h2 style={{ fontSize: 36, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', marginBottom: 40 }}>
            Three things we hold.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {PILLARS.map((p) => (
              <div key={p.title} style={{ display: 'flex', gap: 20 }}>
                <div style={{ fontSize: 20, color: '#D99AB4', flexShrink: 0, paddingTop: 2 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'DM Sans', marginBottom: 6 }}>{p.title}</div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', lineHeight: 1.7 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section style={{ padding: mobile ? '48px 20px' : '80px 80px', position: 'relative' }}>
        <motion.div {...fadeUp} style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>{get('lava.story.history_label', 'THE HISTORY')}</div>
          <h2 style={{ fontSize: 44, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400 }}>{get('lava.story.history_heading', 'How we got here')}</h2>
        </motion.div>
        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          {/* Center line */}
          <div style={{
            position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1,
            background: 'linear-gradient(180deg, transparent, rgba(217,154,180,0.4) 20%, rgba(139,111,184,0.4) 80%, transparent)',
            transform: 'translateX(-50%)'
          }} />
          {TIMELINE.map((item, i) => {
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{
                  display: 'flex', justifyContent: isLeft ? 'flex-start' : 'flex-end',
                  marginBottom: 48, position: 'relative'
                }}
              >
                {/* Dot */}
                <div style={{
                  position: 'absolute', left: '50%', top: 20, transform: 'translateX(-50%)',
                  width: 12, height: 12, borderRadius: '50%',
                  background: `linear-gradient(135deg, #E8906A, #D99AB4)`,
                  boxShadow: '0 0 12px rgba(217,154,180,0.5)'
                }} />
                <LavaGlass style={{
                  width: '44%', padding: '24px 28px',
                  marginLeft: isLeft ? 0 : 'auto', marginRight: isLeft ? 'auto' : 0
                }}>
                  <div style={{ fontSize: 24, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#D99AB4', marginBottom: 6 }}>{item.year}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, fontFamily: 'DM Sans', marginBottom: 8 }}>{item.title}</div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', lineHeight: 1.7 }}>{item.body}</p>
                </LavaGlass>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section style={{
        padding: mobile ? '56px 20px 72px' : '80px 80px 100px', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(232,144,106,0.08) 0%, rgba(139,111,184,0.1) 50%, transparent 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', width: 600, height: 300, top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          background: 'radial-gradient(ellipse, rgba(217,154,180,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none'
        }} />
        <motion.div {...fadeUp} style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: 56, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300,
            marginBottom: 40, lineHeight: 1.2
          }}>
            {get('lava.story.cta', 'Now go be seen.')}
          </p>
          <button
            onClick={() => navigate('/lava/collection')}
            style={{
              padding: '16px 48px', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(90deg, #E8906A, #D96A8A, #8B6FB8)',
              color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2,
              boxShadow: '0 8px 32px rgba(232,144,106,0.4)', transition: 'transform 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            SHOP DROP 04
          </button>
        </motion.div>
      </section>

      <LavaFooter />
    </div>
  )
}
