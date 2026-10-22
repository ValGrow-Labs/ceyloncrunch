'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import ImageUploader from '@/components/admin/ImageUploader'
import SaveButton from '@/components/admin/SaveButton'

export default function BrandingClient({ initial }) {
  const { value: b, setValue: setB, save, saving, saved, error } = useSettingsSave('branding', initial)

  const set = (k, v) => setB(x => ({ ...x, [k]: v }))

  return (
    <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card title="Identity">
        <Field label="Site Name"><Input value={b.site_name || ''} onChange={v => set('site_name', v)} placeholder="Ceylon Crunch" /></Field>
        <Field label="Tagline"><Input value={b.tagline || ''} onChange={v => set('tagline', v)} placeholder="Healthy Crunch for Every Home" /></Field>
        <Field label="Established Year"><Input value={b.established || ''} onChange={v => set('established', v)} placeholder="2020" /></Field>
      </Card>
      <Card title="Logo">
        <ImageUploader value={b.logo_url || ''} onChange={v => set('logo_url', v)} folder="branding" label="Logo Image" />
        {b.logo_url && (
          <div style={{ padding: '16px', background: '#f9f9f9', borderRadius: 12, marginTop: 12 }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>Preview (on light background)</div>
            <img src={b.logo_url} alt="logo preview" style={{ height: 72 }} />
          </div>
        )}
      </Card>
      <Card title="Favicon">
        <ImageUploader value={b.favicon_url || ''} onChange={v => set('favicon_url', v)} folder="branding" label="Favicon URL" />
      </Card>
      {error && <ErrorBox>{error}</ErrorBox>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}

function Card({ title, children }) {
  return <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div></div>
}
function Field({ label, children }) {
  return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div>
}
function Input({ value, onChange, placeholder, type = 'text' }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS}
    onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
}
function ErrorBox({ children }) {
  return <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{children}</div>
}
const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
