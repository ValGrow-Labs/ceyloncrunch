'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import ImageUploader from '@/components/admin/ImageUploader'
import SaveButton from '@/components/admin/SaveButton'

export default function SEOClient({ initial }) {
  const { value: s, setValue: setS, save, saving, saved, error } = useSettingsSave('seo', initial)
  const set = (k, v) => setS(x => ({ ...x, [k]: v }))

  return (
    <div style={{ maxWidth: 660, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card title="Meta Tags">
        <Field label={`Page Title (${(s.title || '').length}/60)`}>
          <Input value={s.title || ''} onChange={v => set('title', v)} placeholder="Ceylon Crunch | Healthy Crunch for Every Home" />
          <div style={{ fontSize: 12, color: (s.title || '').length > 60 ? '#dc2626' : '#9ca3af', marginTop: 4 }}>{(s.title || '').length > 60 ? 'Too long — keep under 60 characters' : 'Optimal: 50–60 characters'}</div>
        </Field>
        <Field label={`Meta Description (${(s.description || '').length}/160)`}>
          <Textarea value={s.description || ''} onChange={v => set('description', v)} placeholder="Ceylon Crunch — Premium Sri Lankan nuts and healthy snacks." />
          <div style={{ fontSize: 12, color: (s.description || '').length > 160 ? '#dc2626' : '#9ca3af', marginTop: 4 }}>{(s.description || '').length > 160 ? 'Too long — keep under 160 characters' : 'Optimal: 120–160 characters'}</div>
        </Field>
        <Field label="Keywords (comma-separated)">
          <Input value={s.keywords || ''} onChange={v => set('keywords', v)} placeholder="Sri Lankan nuts, healthy snacks, cashews, almonds" />
        </Field>
      </Card>
      <Card title="Open Graph Image">
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 8 }}>Shown when your site is shared on WhatsApp, Facebook, etc. Recommended: 1200×630px.</p>
        <ImageUploader value={s.og_image || ''} onChange={v => set('og_image', v)} folder="seo" label="OG Image" />
      </Card>
      {/* SERP Preview */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>Search Result Preview</h3>
        <div style={{ padding: 16, border: '1px solid #e5e7eb', borderRadius: 10 }}>
          <div style={{ fontSize: 18, color: '#1a0dab', marginBottom: 4, fontFamily: 'Arial, sans-serif' }}>{s.title || 'Page Title'}</div>
          <div style={{ fontSize: 13, color: '#006621', marginBottom: 4 }}>ceyloncrunch.lk</div>
          <div style={{ fontSize: 14, color: '#545454', lineHeight: 1.5, fontFamily: 'Arial, sans-serif' }}>{(s.description || 'Meta description...').slice(0, 160)}</div>
        </div>
      </div>
      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}
const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
const FP = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = '#e5e7eb' }
function Card({ title, children }) { return <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div></div> }
function Field({ label, children }) { return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div> }
function Input({ value, onChange, placeholder }) { return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS} {...FP} /> }
function Textarea({ value, onChange, placeholder }) { return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...IS, resize: 'vertical' }} {...FP} /> }
