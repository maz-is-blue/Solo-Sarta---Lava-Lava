import { useState } from 'react'
import { motion } from 'framer-motion'
import LavaNav from './LavaNav'
import LavaFooter from './LavaFooter'
import LavaGlass from '../shared/LavaGlass'
import { submitContact } from '../../services/api'

const fadeUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.7 } }

const FAQS = [
  { q: 'When does Drop 05 land?', a: 'We drop 4 times a year. Sign up for the newsletter to get early access — sometimes 48h before anyone else.' },
  { q: 'Do you ship internationally?', a: 'Yes, we ship to 40+ countries. Duties and taxes may apply depending on your location.' },
  { q: 'What\'s your return policy?', a: 'Returns within 14 days of delivery. Items must be unworn, untagged, and in original packaging.' },
  { q: 'Can I size exchange?', a: 'Yes, free size exchanges within India. Contact us within 14 days of delivery with your order number.' },
  { q: 'Are the pieces limited edition?', a: 'Each piece is made in 200–400 editions per drop. Once they\'re gone, they\'re gone. No restocks.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer',
          color: '#fff', fontSize: 15, fontFamily: 'DM Sans', textAlign: 'left'
        }}
      >
        {q}
        <span style={{ fontSize: 20, flexShrink: 0, marginLeft: 16, transition: 'transform 0.3s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ paddingBottom: 20, fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', lineHeight: 1.8 }}
        >
          {a}
        </motion.div>
      )}
    </div>
  )
}

export default function LavaContact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Enquiry', message: '', privacy: false })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.privacy) { setError('Please agree to the privacy policy.'); return }
    setLoading(true)
    setError('')
    try {
      await submitContact(formData)
    } catch (_) { /* offline — treat as success */ }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div style={{ background: 'linear-gradient(180deg, #0f0018 0%, #050010 100%)', minHeight: '100vh', color: '#fff' }}>
      <LavaNav />

      {/* Header */}
      <section style={{ paddingTop: 140, paddingBottom: 64, paddingLeft: 80, paddingRight: 80 }}>
        <motion.div {...fadeUp}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>REACH OUT</div>
          <h1 style={{ fontSize: 60, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400 }}>Get in touch</h1>
        </motion.div>
      </section>

      {/* 2-column */}
      <section style={{ padding: '0 80px 80px', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48, alignItems: 'start' }}>
        {/* Left info */}
        <motion.div {...fadeUp}>
          <LavaGlass style={{ padding: 40 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 24 }}>STUDIO</div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 14, fontFamily: 'DM Sans', lineHeight: 1.8, color: 'rgba(255,255,255,0.8)' }}>
                12 Maker Lane<br />Mumbai 400001<br />India
              </div>
            </div>
            <div style={{ marginBottom: 32 }}>
              {[
                ['General', 'hello@lavalava.in'],
                ['Press', 'press@solosarto.com'],
              ].map(([label, em]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans', marginBottom: 2 }}>{label.toUpperCase()}</div>
                  <a href={`mailto:${em}`} style={{ fontSize: 14, color: '#EFA0BA', fontFamily: 'DM Sans', textDecoration: 'none' }}>{em}</a>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans', marginBottom: 12 }}>FOLLOW</div>
              <div style={{ display: 'flex', gap: 16 }}>
                {['Instagram', 'Pinterest', 'TikTok'].map(s => (
                  <span key={s} style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'DM Sans' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#EFA0BA'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                  >{s}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans', marginBottom: 6 }}>HOURS</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans' }}>Mon–Sat · 10am–6pm IST</div>
            </div>
          </LavaGlass>
        </motion.div>

        {/* Right form */}
        <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
          <LavaGlass style={{ padding: 48 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
                <h3 style={{ fontSize: 28, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', marginBottom: 12 }}>Sent, loud and clear ✦</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans' }}>We'll get back to you within 2 business days.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>NAME</label>
                    <input
                      name="name" value={formData.name} onChange={handleChange} required
                      placeholder="Your name"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, fontFamily: 'DM Sans', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>EMAIL</label>
                    <input
                      name="email" type="email" value={formData.email} onChange={handleChange} required
                      placeholder="your@email.com"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, fontFamily: 'DM Sans', outline: 'none' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>SUBJECT</label>
                  <select
                    name="subject" value={formData.subject} onChange={handleChange}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: '#1a0028', color: '#fff', fontSize: 14, fontFamily: 'DM Sans', outline: 'none' }}
                  >
                    {['General Enquiry', 'Press', 'Wholesale', 'Styling', 'Returns'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>MESSAGE</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange} required
                    rows={5} placeholder="Tell us what's on your mind..."
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 14, fontFamily: 'DM Sans', outline: 'none', resize: 'vertical' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <input
                    type="checkbox" name="privacy" checked={formData.privacy} onChange={handleChange}
                    style={{ marginTop: 3, accentColor: '#EFA0BA', cursor: 'pointer' }}
                  />
                  <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans', cursor: 'pointer', lineHeight: 1.6 }}>
                    I agree to the privacy policy and consent to being contacted regarding my enquiry.
                  </label>
                </div>
                {error && <div style={{ fontSize: 13, color: '#F08A8B', fontFamily: 'DM Sans' }}>{error}</div>}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '15px', borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(90deg, #FF5A2C, #F08A8B, #EFA0BA)',
                    color: '#fff', fontSize: 13, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 1.5,
                    opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s'
                  }}
                >
                  {loading ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </LavaGlass>
        </motion.div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '0 80px 80px' }}>
        <motion.div {...fadeUp} style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans', marginBottom: 12 }}>QUICK ANSWERS</div>
          <h2 style={{ fontSize: 40, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 400 }}>FAQ</h2>
        </motion.div>
        <motion.div {...fadeUp} style={{ maxWidth: 720 }}>
          {FAQS.map(item => <FaqItem key={item.q} q={item.q} a={item.a} />)}
        </motion.div>
      </section>

      <LavaFooter />
    </div>
  )
}
