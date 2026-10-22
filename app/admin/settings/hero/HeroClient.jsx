'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import ImageUploader from '@/components/admin/ImageUploader'
import SaveButton from '@/components/admin/SaveButton'

export default function HeroClient({ initial }) {
  const { value: h, setValue: setH, save, saving, saved, error } = useSettingsSave('hero', initial)
  const set = (k, v) => setH(x => ({ ...x, [k]: v }))

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card title="Eyebrow & Headline">
        <Field label="Eyebrow Text (above headline)">
          <Input value={h.eyebrow || ''} onChange={v => set('eyebrow', v)} placeholder="Ceylon Crunch — Est. 2020" />
        </Field>
        <Field label="Main Headline">
          <Input value={h.headline || ''} onChange={v => set('headline', v)} placeholder="In a world that rushes everything," />
        </Field>
        <Field label="Italic / Accent Line">
          <Input value={h.headline_italic || ''} onChange={v => set('headline_italic', v)} placeholder="we chose to wait." />
        </Field>
        <Field label="Subtext Paragraph">
          <Textarea value={h.subtext || ''} onChange={v => set('subtext', v)} placeholder="Sourced from Sri Lankan growers..." />
        </Field>
      </Card>

      <Card title="Call-to-Action Buttons">
        <Row>
          <Field label="Primary CTA Text"><Input value={h.primary_cta || ''} onChange={v => set('primary_cta', v)} placeholder="Shop the Collection" /></Field>
          <Field label="Primary CTA Link"><Input value={h.primary_cta_link || ''} onChange={v => set('primary_cta_link', v)} placeholder="/shop" /></Field>
        </Row>
        <Row>
          <Field label="Secondary CTA Text"><Input value={h.secondary_cta || ''} onChange={v => set('secondary_cta', v)} placeholder="Our Story" /></Field>
          <Field label="Secondary CTA Link"><Input value={h.secondary_cta_link || ''} onChange={v => set('secondary_cta_link', v)} placeholder="/about" /></Field>
        </Row>
      </Card>

      <Card title="Background Image">
        <ImageUploader value={h.bg_image || ''} onChange={v => set('bg_image', v)} folder="hero" label="Hero Background Image" />
        <Field label="Background Opacity (0 = transparent, 1 = full)">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <input type="range" min={0} max={1} step={0.01} value={h.bg_opacity ?? 0.52} onChange={e => set('bg_opacity', parseFloat(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--green)' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', minWidth: 36 }}>{(h.bg_opacity ?? 0.52).toFixed(2)}</span>
          </div>
        </Field>
      </Card>

      {/* Live preview strip */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>Preview</h3>
        <div style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', minHeight: 200, background: '#f0e8d8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', textAlign: 'center' }}>
          {h.bg_image && <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${h.bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: h.bg_opacity ?? 0.52 }} />}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#2a7043', fontWeight: 700, marginBottom: 8 }}>{h.eyebrow || 'Eyebrow text'}</p>
            <h2 style={{ fontFamily: 'Playfair Display,serif', fontSize: 28, color: '#1E5631', marginBottom: 8 }}>{h.headline || 'Main headline'}<br /><em style={{ color: '#7B3F00' }}>{h.headline_italic || 'italic line'}</em></h2>
            <p style={{ fontSize: 13, color: '#1a1a1a', marginBottom: 16, maxWidth: 400 }}>{h.subtext || 'Subtext paragraph'}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button style={{ padding: '8px 18px', background: '#1E5631', color: '#fff', border: 'none', borderRadius: 50, fontSize: 12, fontWeight: 600 }}>{h.primary_cta || 'Primary CTA'}</button>
              <button style={{ padding: '7px 16px', background: 'transparent', color: '#1E5631', border: '2px solid #1E5631', borderRadius: 50, fontSize: 12, fontWeight: 600 }}>{h.secondary_cta || 'Secondary CTA'}</button>
            </div>
          </div>
        </div>
      </div>

      {error && <ErrBox>{error}</ErrBox>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}

const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
const FP = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = '#e5e7eb' }
function Card({ title, children }) { return <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div></div> }
function Field({ label, children }) { return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div> }
function Row({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div> }
function Input({ value, onChange, placeholder }) { return <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS} {...FP} /> }
function Textarea({ value, onChange, placeholder }) { return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...IS, resize: 'vertical' }} {...FP} /> }
function ErrBox({ children }) { return <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{children}</div> }
