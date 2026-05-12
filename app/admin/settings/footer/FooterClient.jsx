'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import SaveButton from '@/components/admin/SaveButton'

export default function FooterClient({ initial }) {
  const { value: f, setValue: setF, save, saving, saved, error } = useSettingsSave('footer', initial)
  const set = (k, v) => setF(x => ({ ...x, [k]: v }))
  const setSocial = (k, v) => setF(x => ({ ...x, social: { ...x.social, [k]: v } }))

  return (
    <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card title="Brand Tagline & Copyright">
        <Field label="Footer Tagline"><Textarea value={f.tagline || ''} onChange={v => set('tagline', v)} placeholder="Healthy Crunch for Every Home." /></Field>
        <Field label="Sub-tagline (right side)"><Input value={f.sub_tagline || ''} onChange={v => set('sub_tagline', v)} placeholder="Crafted with patience. Packed with care." /></Field>
        <Field label="Copyright Line"><Input value={f.copyright || ''} onChange={v => set('copyright', v)} placeholder="© 2020–2026 Ceylon Crunch. All rights reserved." /></Field>
      </Card>
      <Card title="Contact Information">
        <Field label="Contact Email"><Input type="email" value={f.contact_email || ''} onChange={v => set('contact_email', v)} placeholder="hello@ceyloncrunch.lk" /></Field>
        <Field label="Address"><Input value={f.address || ''} onChange={v => set('address', v)} placeholder="Colombo, Sri Lanka" /></Field>
      </Card>
      <Card title="Social Media Links">
        {[['instagram', 'Instagram URL'], ['facebook', 'Facebook URL'], ['whatsapp', 'WhatsApp Number'], ['tiktok', 'TikTok URL']].map(([k, label]) => (
          <Field key={k} label={label}><Input value={f.social?.[k] || ''} onChange={v => setSocial(k, v)} placeholder={k === 'whatsapp' ? '+94 77 xxx xxxx' : `https://${k}.com/ceyloncrunch`} /></Field>
        ))}
      </Card>
      {error && <ErrBox>{error}</ErrBox>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}
const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
const FP = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = '#e5e7eb' }
function Card({ title, children }) { return <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div></div> }
function Field({ label, children }) { return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div> }
function Input({ value, onChange, placeholder, type = 'text' }) { return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS} {...FP} /> }
function Textarea({ value, onChange, placeholder }) { return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...IS, resize: 'vertical' }} {...FP} /> }
function ErrBox({ children }) { return <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{children}</div> }
