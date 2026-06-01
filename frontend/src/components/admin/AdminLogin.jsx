import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin } from '../../services/adminApi'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await adminLogin(password)
      localStorage.setItem('ss_admin_token', res.data.token)
      navigate('/admin')
    } catch {
      setError('Incorrect password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1A1410 0%, #2A2420 50%, #1e1030 100%)',
      fontFamily: 'DM Sans',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>

        {/* Logo row */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 10, letterSpacing: 4, color: 'rgba(201,169,110,0.5)', marginBottom: 12 }}>
            SOLO SARTO × LAVA LAVA
          </div>
          <h1 style={{
            fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontWeight: 300,
            fontSize: 32, color: '#FAF8F5', margin: 0
          }}>
            Admin Panel
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(250,248,245,0.4)', marginBottom: 8 }}>
              PASSWORD
            </div>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              autoFocus
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(250,248,245,0.12)',
                borderRadius: 3, padding: '14px 16px',
                fontSize: 14, fontFamily: 'DM Sans', color: '#FAF8F5',
                outline: 'none',
              }}
            />
          </div>

          {error && (
            <div style={{
              fontSize: 12, color: '#E8906A', fontFamily: 'DM Sans',
              padding: '10px 14px', background: 'rgba(232,144,106,0.08)',
              border: '1px solid rgba(232,144,106,0.2)', borderRadius: 3, marginBottom: 16
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', borderRadius: 3, border: 'none', cursor: 'pointer',
              background: loading ? 'rgba(201,169,110,0.4)' : '#C9A96E',
              color: '#1A1A1A', fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans', letterSpacing: 2
            }}
          >
            {loading ? 'VERIFYING...' : 'ENTER'}
          </button>
        </form>

        {/* Brand selector hint */}
        <div style={{ marginTop: 48, display: 'flex', gap: 12 }}>
          <div style={{
            flex: 1, padding: '14px', borderRadius: 3, border: '1px solid rgba(201,169,110,0.2)',
            textAlign: 'center', cursor: 'default', opacity: 0.5
          }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#C9A96E', marginBottom: 4 }}>ATELIER</div>
            <div style={{ fontSize: 12, color: '#FAF8F5', fontFamily: 'Cormorant Garamond', fontStyle: 'italic' }}>Solo Sarto</div>
          </div>
          <div style={{
            flex: 1, padding: '14px', borderRadius: 999, border: '1px solid rgba(139,111,184,0.2)',
            textAlign: 'center', cursor: 'default', opacity: 0.5,
            background: 'linear-gradient(135deg, rgba(232,144,106,0.06), rgba(139,111,184,0.06))'
          }}>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#A990CC', marginBottom: 4 }}>DIFFUSION</div>
            <div style={{ fontSize: 12, color: '#FAF8F5', fontFamily: 'DM Sans', fontWeight: 600 }}>Lava Lava</div>
          </div>
        </div>
      </div>
    </div>
  )
}
