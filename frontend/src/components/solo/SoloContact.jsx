import { useState } from 'react'
import { motion } from 'framer-motion'
import SoloNav from './SoloNav'

const GRAIN = 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")'

const INQUIRY_TYPES = [
  'Bespoke Commission',
  'Request a Fitting',
  'Private Viewing',
  'Press & Media',
  'General Enquiry',
]

const INPUT = {
  width: '100%', padding: '14px 18px', boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,169,110,0.2)',
  color: '#FAF8F5', fontFamily: 'DM Sans', fontSize: 14, outline: 'none',
  borderRadius: 2, transition: 'border-color 0.2s ease'
}

export default function SoloContact() {
  const [form, setForm] = useState({ name: '', email: '', type: INQUIRY_TYPES[0], message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [focused, setFocused] = useState(null)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
  }

  const focusStyle = key => ({
    ...INPUT,
    borderColor: focused === key ? 'rgba(201,169,110,0.7)' : 'rgba(201,169,110,0.2)'
  })

  return (
    <div style={{ background: '#2A2420', minHeight: '100vh', color: '#FAF8F5', position: 'relative' }}>
      <div style={{ position: 'fixed', inset: 0, opacity: 0.03, pointerEvents: 'none', zIndex: 0, backgroundImage: GRAIN, backgroundSize: 'cover' }} />
      <SoloNav />

      <div style={{ paddingTop: 88, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ padding: '64px 80px 0' }}
        >
          <div style={{ fontSize: 11, letterSpacing: 4, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 20 }}>CONTACT</div>
          <h1 style={{ fontSize: 60, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, lineHeight: 1.05, marginBottom: 16 }}>
            Begin the conversation.
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(250,248,245,0.45)', fontFamily: 'DM Sans', maxWidth: 480, lineHeight: 1.8 }}>
            All commissions, fittings and viewings begin here. We respond within 48 hours.
          </p>
        </motion.section>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, padding: '64px 80px 96px', alignItems: 'start' }}>
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {submitted ? (
              <div style={{
                background: 'linear-gradient(135deg, #2E2822, #201C18)',
                border: '1px solid rgba(201,169,110,0.2)',
                borderRadius: 4, padding: '64px 48px', textAlign: 'center'
              }}>
                <div style={{ fontSize: 40, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', marginBottom: 20, color: '#C9A96E' }}>✦</div>
                <h3 style={{ fontSize: 28, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, marginBottom: 16 }}>
                  Your message has been received.
                </h3>
                <p style={{ fontSize: 14, color: 'rgba(250,248,245,0.5)', fontFamily: 'DM Sans', lineHeight: 1.8 }}>
                  We will respond within 48 hours. The atelier is open by appointment only, Monday through Saturday.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>NAME</label>
                    <input
                      type="text" required value={form.name} onChange={set('name')}
                      placeholder="Your name"
                      style={focusStyle('name')}
                      onFocus={() => setFocused('name')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>EMAIL</label>
                    <input
                      type="email" required value={form.email} onChange={set('email')}
                      placeholder="your@email.com"
                      style={focusStyle('email')}
                      onFocus={() => setFocused('email')}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>INQUIRY TYPE</label>
                  <select
                    value={form.type} onChange={set('type')}
                    style={{ ...focusStyle('type'), cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23C9A96E' fill='none' strokeWidth='1.5'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center' }}
                    onFocus={() => setFocused('type')}
                    onBlur={() => setFocused(null)}
                  >
                    {INQUIRY_TYPES.map(t => <option key={t} value={t} style={{ background: '#2A2420' }}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans', display: 'block', marginBottom: 8 }}>MESSAGE</label>
                  <textarea
                    required value={form.message} onChange={set('message')}
                    placeholder="Tell us what you have in mind — a piece, an occasion, or just a feeling."
                    rows={6}
                    style={{ ...focusStyle('message'), resize: 'vertical', minHeight: 140 }}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    padding: '15px 32px', borderRadius: 2, border: 'none', cursor: 'pointer',
                    background: '#C9A96E', color: '#1A1A1A',
                    fontSize: 11, fontWeight: 600, fontFamily: 'DM Sans', letterSpacing: 2,
                    alignSelf: 'flex-start', transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  SEND MESSAGE
                </button>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 48 }}
          >
            {/* Atelier details */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, color: '#C9A96E', fontFamily: 'DM Sans', marginBottom: 24 }}>THE ATELIER</div>
              {[
                ['Email', 'studio@solosarto.com'],
                ['Hours', 'Mon–Sat, 10am–6pm'],
                ['Appointments', 'By arrangement only'],
                ['Response time', 'Within 48 hours'],
              ].map(([k, v]) => (
                <div key={k} style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', padding: '14px 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', letterSpacing: 1 }}>{k.toUpperCase()}</span>
                  <span style={{ fontSize: 13, color: 'rgba(250,248,245,0.7)', fontFamily: 'DM Sans' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Private circle */}
            <div style={{
              background: 'linear-gradient(135deg, #2E2822, #201C18)',
              border: '1px solid rgba(201,169,110,0.15)',
              borderRadius: 4, padding: '32px 28px'
            }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(201,169,110,0.5)', fontFamily: 'DM Sans', marginBottom: 12 }}>THE PRIVATE CIRCLE</div>
              <h4 style={{ fontSize: 22, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300, marginBottom: 12, lineHeight: 1.3 }}>
                An invitation to our<br />private seasonal viewing.
              </h4>
              <p style={{ fontSize: 13, color: 'rgba(250,248,245,0.45)', fontFamily: 'DM Sans', lineHeight: 1.7, marginBottom: 20 }}>
                Three times a year, we invite a small group of clients to preview the next collection before it is announced. Mention your interest in the message above.
              </p>
              <div style={{ fontSize: 11, color: 'rgba(201,169,110,0.6)', fontFamily: 'DM Sans', letterSpacing: 1.5 }}>BY INVITATION ONLY</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
