'use client'
import { useState, useRef } from 'react'

export default function ImageUploader({ value, onChange, folder = 'products', label = 'Image' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    const form = new FormData()
    form.append('file', file)
    form.append('folder', folder)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {value && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={value} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '2px solid var(--border)' }} />
            <button onClick={() => onChange('')}
              style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#c0392b', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
          </div>
        )}
        <div style={{ flex: 1 }}>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
          <input type="text" value={value || ''} onChange={e => onChange(e.target.value)}
            placeholder="Paste image URL or upload..."
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
          <button type="button" onClick={() => inputRef.current.click()} disabled={uploading}
            style={{ marginTop: 8, padding: '8px 16px', background: uploading ? '#e5e7eb' : '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, cursor: 'pointer', color: '#374151' }}>
            {uploading ? 'Uploading…' : '↑ Upload Image'}
          </button>
        </div>
      </div>
      {error && <div style={{ fontSize: 13, color: '#dc2626', marginTop: 6 }}>{error}</div>}
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }
const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
