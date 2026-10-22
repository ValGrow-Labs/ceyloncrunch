'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import SaveButton from '@/components/admin/SaveButton'

export default function AnnouncementClient({ initial }) {
  const { value: a, setValue: setA, save, saving, saved, error } = useSettingsSave('announcement_bar', initial)
  const set = (k, v) => setA(x => ({ ...x, [k]: v }))

  return (
    <div style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #f3f4f6' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>Announcement Bar</h3>
          <Toggle enabled={a.enabled} onToggle={v => set('enabled', v)} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Message"><Input value={a.message || ''} onChange={v => set('message', v)} placeholder="Free delivery on orders over LKR 3,000!" /></Field>
          <Row>
            <Field label="Background Color">
              <ColorPicker value={a.bg_color || '#1E5631'} onChange={v => set('bg_color', v)} />
            </Field>
            <Field label="Text Color">
              <ColorPicker value={a.text_color || '#ffffff'} onChange={v => set('text_color', v)} />
            </Field>
          </Row>
          <Row>
            <Field label="Link URL (optional)"><Input value={a.link || ''} onChange={v => set('link', v)} placeholder="/shop" /></Field>
            <Field label="Link Label"><Input value={a.link_label || ''} onChange={v => set('link_label', v)} placeholder="Shop Now" /></Field>
          </Row>
        </div>
      </div>

      {/* Live preview */}
      {a.enabled && a.message && (
        <div style={{ borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ background: a.bg_color || '#1E5631', color: a.text_color || '#fff', padding: '10px 20px', textAlign: 'center', fontSize: 13, fontWeight: 500 }}>
            {a.message}
            {a.link && a.link_label && <span style={{ marginLeft: 12, fontWeight: 700, textDecoration: 'underline' }}>{a.link_label}</span>}
          </div>
          <div style={{ padding: '8px 12px', background: '#f9fafb', fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>Preview of announcement bar</div>
        </div>
      )}

      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}

function Toggle({ enabled, onToggle }) {
  return <button onClick={() => onToggle(!enabled)} style={{ width: 44, height: 24, borderRadius: 50, border: 'none', cursor: 'pointer', background: enabled ? 'var(--green)' : '#e5e7eb', position: 'relative', transition: 'background 0.2s' }}><div style={{ position: 'absolute', top: 3, left: enabled ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} /></button>
}
function ColorPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <div style={{ position: 'relative', width: 36, height: 36, borderRadius: 8, background: value, border: '2px solid #e5e7eb', overflow: 'hidden' }}>
        <input type="color" value={value} onChange={e => onChange(e.target.value)} style={{ position: 'absolute', inset: -4, width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', opacity: 0, cursor: 'pointer' }} />
      </div>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', outline: 'none' }} onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
    </div>
  )
}
const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
const FP = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = '#e5e7eb' }
function Field({ label, children }) { return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div> }
function Row({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div> }
function Input({ value, onChange, placeholder }) { return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS} {...FP} /> }
