import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SoloNav from './SoloNav'
import SoloFooter from './SoloFooter'
import { useMobile } from '../../hooks/useMobile'
import { useContent } from '../../context/ContentContext'

const GRAIN = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'

function ThreadLine() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '48px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3))' }} />
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A96E', opacity: 0.6 }} />
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(201,169,110,0.3), transparent)' }} />
    </div>
  )
}

export default function SoloStory() {
  const navigate = useNavigate()
  const mobile = useMobile()
  const { get } = useContent()

  const PILLARS = [
    { title: get('solo.story.pillar1_title', 'Singularity'), body: get('solo.story.pillar1_body', 'We have never made two identical pieces. Every pattern is drawn by hand for one person, then destroyed.') },
    { title: get('solo.story.pillar2_title', 'Time'), body: get('solo.story.pillar2_body', 'A Solo Sarto commission takes between two and five weeks. This is not a flaw — it is the point.') },
    { title: get('solo.story.pillar3_title', 'Silence'), body: get('solo.story.pillar3_body', 'No seasonal collections. No lookbooks. No fast fashion. We work when we are ready, for clients who are ready to wait.') },
  ]

  return (
    <div style={{ background: '#2A2420', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />
      <SoloNav />

      <div style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ padding: mobile ? '40px 24px 40px' : '72px 80px 64px', borderBottom: '1px solid rgba(201,169,110,0.1)' }}
        >
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 24 }}>{get('solo.story.eyebrow', 'OUR STORY')}</div>
          <h1 style={{
            fontSize: 68, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300,
            lineHeight: 1.05, maxWidth: 800, marginBottom: 32, color: '#FAF8F5'
          }}>
            {get('solo.story.headline', 'Bespoke Fantasy')}
          </h1>

        </motion.section>

        {/* Founding */}
        <section style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? 32 : 80, padding: mobile ? '40px 24px' : '80px 80px', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 20 }}>{get('solo.story.begin_label', 'THE BEGINNING')}</div>
            <h2 style={{ fontSize: 40, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.2, marginBottom: 28 }}>
              {get('solo.story.begin_headline', 'Shiyam started alone. On purpose.')}
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.6)', fontFamily: 'DM Sans', lineHeight: 1.9, marginBottom: 20 }}>
              {get('solo.story.begin_body', 'With a foundation built on artistic excellence and a rich history of collaborating with top fashion designers and artists, Shiyam brings her unique vision and refined skills to create timeless designs. Specializing in exquisite evening wear and bespoke wedding dresses, she aims to craft your perfect look for every cherished moment.')}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #2E2822, #201C18)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 4, padding: '48px 40px', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', width: 300, height: 300, top: -60, right: -60,
                background: 'radial-gradient(circle, rgba(201,169,110,0.1) 0%, transparent 70%)',
                filter: 'blur(50px)', pointerEvents: 'none'
              }} />
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(201,169,110,0.4)', fontFamily: 'DM Sans', marginBottom: 20 }}>EST. 2018</div>
              {[
                [get('solo.story.stat1_value','148'), get('solo.story.stat1_label','Pieces per year')],
                [get('solo.story.stat2_value','11'), get('solo.story.stat2_label','Master tailors')],
                [get('solo.story.stat3_value','2'), get('solo.story.stat3_label','Fittings minimum')],
                [get('solo.story.stat4_value','0'), get('solo.story.stat4_label','Pieces alike')],
              ].map(([n, l]) => (
                <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid rgba(201,169,110,0.08)', padding: '16px 0' }}>
                  <span style={{ fontSize: 32, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#C9A96E' }}>{n}</span>
                  <span style={{ fontSize: 12, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans', letterSpacing: 1 }}>{l.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <ThreadLine />

        {/* Philosophy */}
        <section style={{ padding: mobile ? '0 24px 48px' : '0 80px 80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: 56 }}
          >
            <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 12 }}>{get('solo.story.philosophy_label', 'OUR PHILOSOPHY')}</div>
            <h2 style={{ fontSize: 44, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300 }}>{get('solo.story.philosophy_intro', 'Four things we believe in.')}</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: mobile ? 24 : 40 }}>
            {PILLARS.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ borderLeft: '2px solid rgba(201,169,110,0.3)', paddingLeft: 28 }}
              >
                <div style={{ fontSize: 22, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5', marginBottom: 12 }}>{p.title}</div>
                <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.55)', fontFamily: 'DM Sans', lineHeight: 1.8 }}>{p.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <ThreadLine />

        {/* Quote */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ padding: '0 80px 96px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}
        >
          <p style={{ fontSize: 34, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.4, color: 'rgba(250,248,245,0.85)', marginBottom: 24 }}>
            "{get('solo.story.quote', 'We are not in the business of clothing people. We are in the business of making something that, fifty years from now, someone\'s daughter will still wear.')}"
          </p>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans' }}>{get('solo.story.quote_attr', '— SHIYAM, FOUNDER')}</div>
        </motion.section>

        {/* CTA band */}
        <div style={{ background: '#FAF8F5', padding: mobile ? '40px 24px' : '64px 80px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(26,26,26,0.4)', fontFamily: 'DM Sans', marginBottom: 10 }}>READY TO BEGIN?</div>
            <h3 style={{ fontSize: 30, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#1A1A1A', fontWeight: 300 }}>
              Every commission starts with a conversation.
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/solo/collection')}
              style={{
                padding: '13px 28px', borderRadius: 2, cursor: 'pointer',
                border: '1px solid rgba(26,26,26,0.3)', background: 'transparent',
                color: '#1A1A1A', fontSize: 11, fontFamily: 'DM Sans', letterSpacing: 2
              }}
            >
              THE COLLECTION
            </button>
            <button
              onClick={() => navigate('/solo/contact')}
              style={{
                padding: '13px 28px', borderRadius: 2, border: 'none', cursor: 'pointer',
                background: '#C9A96E', color: '#1A1A1A',
                fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2
              }}
            >
              GET IN TOUCH
            </button>
          </div>
        </div>
      </div>
      <SoloFooter />
    </div>
  )
}
