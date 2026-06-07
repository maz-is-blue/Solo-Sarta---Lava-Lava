import { useState, useEffect } from 'react'
import { getAdminVideos, createAdminVideo, deleteAdminVideo } from '../../services/adminApi'

export default function AdminVideosTab({ brand, accent }) {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [urlInput, setUrlInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { load() }, [brand])

  const load = () => {
    setLoading(true)
    getAdminVideos(brand)
      .then(r => setVideos(r.data))
      .catch(() => setError('Failed to load videos.'))
      .finally(() => setLoading(false))
  }

  const addByUrl = async () => {
    const url = urlInput.trim()
    if (!url) return
    setAdding(true); setError('')
    try {
      const r = await createAdminVideo({ brand, url, sort_order: videos.length })
      setVideos(prev => [...prev, r.data])
      setUrlInput('')
    } catch { setError('Failed to add video.') }
    setAdding(false)
  }

  const handleDelete = async (id) => {
    try {
      await deleteAdminVideo(id)
      setVideos(prev => prev.filter(v => v.id !== id))
    } catch { setError('Failed to remove video.') }
    setDeleteId(null)
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 800 }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 10, letterSpacing: 2, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginBottom: 4 }}>MANAGE</div>
        <div style={{ fontSize: 22, fontFamily: 'Cormorant Garamond', fontStyle: 'italic', color: '#FAF8F5' }}>Hero Videos</div>
        <div style={{ fontSize: 12, color: 'rgba(250,248,245,0.35)', fontFamily: 'DM Sans', marginTop: 6, lineHeight: 1.6 }}>
          Videos play in the background of the home page hero, cycling automatically.<br />
          When no videos are added, the hero shows the default design.
        </div>
      </div>

      {/* How to get a URL */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8, padding: '16px 20px', marginBottom: 20,
        fontSize: 12, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans', lineHeight: 1.8,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'rgba(250,248,245,0.25)', marginBottom: 8 }}>HOW TO GET A VIDEO URL</div>
        1. Go to <span style={{ color: accent }}>cloudinary.com</span> (free) → Upload your video → copy the URL<br />
        2. Or use Google Drive: share the file → copy link → paste below<br />
        3. Any direct MP4 / WebM link works
      </div>

      {error && <div style={{ marginBottom: 16, fontSize: 12, color: '#E8906A', fontFamily: 'DM Sans' }}>{error}</div>}

      {/* Add video */}
      <div style={{
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8, padding: '20px 24px', marginBottom: 28,
      }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: 'rgba(250,248,245,0.4)', fontFamily: 'DM Sans', marginBottom: 14 }}>ADD VIDEO</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addByUrl())}
            placeholder="Paste video URL here..."
            style={{
              flex: 1, background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6,
              padding: '11px 14px', fontSize: 13, fontFamily: 'DM Sans',
              color: '#FAF8F5', outline: 'none',
            }}
          />
          <button
            onClick={addByUrl}
            disabled={adding || !urlInput.trim()}
            style={{
              padding: '11px 24px', borderRadius: 6, border: 'none',
              background: accent, color: '#1A1A1A',
              fontSize: 11, fontFamily: 'DM Sans', fontWeight: 700,
              cursor: adding || !urlInput.trim() ? 'not-allowed' : 'pointer',
              opacity: adding || !urlInput.trim() ? 0.6 : 1, whiteSpace: 'nowrap',
            }}
          >
            {adding ? 'Adding...' : 'Add Video'}
          </button>
        </div>
      </div>

      {/* Video list */}
      {loading ? (
        <div style={{ color: 'rgba(250,248,245,0.3)', fontFamily: 'DM Sans', fontSize: 13 }}>Loading...</div>
      ) : videos.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '48px 0',
          color: 'rgba(250,248,245,0.2)', fontFamily: 'Cormorant Garamond', fontStyle: 'italic', fontSize: 20,
        }}>
          No videos yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {videos.map((v, idx) => (
            <div key={v.id} style={{
              display: 'grid', gridTemplateColumns: '140px 1fr auto',
              gap: 16, alignItems: 'center',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '12px 16px',
            }}>
              {/* Preview */}
              <video
                src={v.url}
                preload="metadata"
                muted
                playsInline
                style={{ width: 140, height: 79, objectFit: 'cover', borderRadius: 4, background: '#111', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.play()}
                onMouseLeave={e => { e.currentTarget.pause(); e.currentTarget.currentTime = 0 }}
              />

              <div>
                <div style={{ fontSize: 9, letterSpacing: 1.5, color: accent, fontFamily: 'DM Sans', marginBottom: 6 }}>
                  VIDEO {idx + 1}{videos.length > 1 ? ` OF ${videos.length}` : ''}
                </div>
                <div style={{
                  fontSize: 11, color: 'rgba(250,248,245,0.45)', fontFamily: 'DM Sans',
                  wordBreak: 'break-all', lineHeight: 1.5,
                }}>{v.url}</div>
              </div>

              <button
                onClick={() => setDeleteId(v.id)}
                style={{
                  padding: '7px 12px', borderRadius: 5,
                  border: '1px solid rgba(232,144,106,0.3)',
                  background: 'transparent', color: '#E8906A',
                  fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer', flexShrink: 0,
                }}
              >✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            background: '#1A1410', borderRadius: 12, padding: '36px 40px',
            maxWidth: 360, width: '90%', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <div style={{ fontFamily: 'Cormorant Garamond', fontSize: 22, fontStyle: 'italic', color: '#FAF8F5', marginBottom: 12 }}>Remove this video?</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{ padding: '10px 24px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(250,248,245,0.6)', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer' }}
              >Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{ padding: '10px 24px', borderRadius: 6, border: 'none', background: '#E8906A', color: '#fff', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer', fontWeight: 600 }}
              >Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
