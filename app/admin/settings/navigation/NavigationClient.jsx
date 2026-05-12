'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import SaveButton from '@/components/admin/SaveButton'

export default function NavigationClient({ initial }) {
  const { value: links, setValue: setLinks, save, saving, saved, error } = useSettingsSave('nav_links', initial)

  const set = (i, k, v) => setLinks(l => l.map((x, idx) => idx === i ? { ...x, [k]: v } : x))
  const add = () => setLinks(l => [...l, { label: '', href: '/' }])
  const remove = (i) => setLinks(l => l.filter((_, idx) => idx !== i))
  const move = (i, dir) => {
    const arr = [...links]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setLinks(arr)
  }

  return (
    <div style={{ maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>Navbar Links</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {links.map((link, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto auto auto', gap: 10, alignItems: 'center', padding: 14, background: '#f9fafb', borderRadius: 10 }}>
              <input value={link.label} onChange={e => set(i, 'label', e.target.value)} placeholder="Label (e.g. Shop)"
                style={IS} onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <input value={link.href} onChange={e => set(i, 'href', e.target.value)} placeholder="Path (e.g. /shop)"
                style={IS} onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              <button onClick={() => move(i, -1)} disabled={i === 0}
                style={{ padding: '8px 10px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: i === 0 ? 'not-allowed' : 'pointer', opacity: i === 0 ? 0.4 : 1, fontSize: 14 }}>↑</button>
              <button onClick={() => move(i, 1)} disabled={i === links.length - 1}
                style={{ padding: '8px 10px', background: '#f3f4f6', border: 'none', borderRadius: 8, cursor: i === links.length - 1 ? 'not-allowed' : 'pointer', opacity: i === links.length - 1 ? 0.4 : 1, fontSize: 14 }}>↓</button>
              <button onClick={() => remove(i)}
                style={{ padding: '8px 10px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>✕</button>
            </div>
          ))}
        </div>
        <button onClick={add} style={{ marginTop: 12, width: '100%', padding: '10px', background: '#f0f7f2', color: 'var(--green)', border: '1.5px dashed var(--green)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          + Add Link
        </button>
      </div>

      {/* Preview */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 12 }}>Navbar Preview</div>
        <div style={{ display: 'flex', gap: 24, padding: '12px 20px', background: 'rgba(250,246,239,0.9)', borderRadius: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1E5631', fontFamily: 'Playfair Display,serif' }}>Ceylon Crunch</div>
          {links.map((l, i) => <span key={i} style={{ fontSize: 14, color: '#3d3d3d', fontWeight: 400 }}>{l.label || '—'}</span>)}
        </div>
      </div>

      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}

const IS = { width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
