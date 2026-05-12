'use client'
import { useState } from 'react'
import ImageUploader from '@/components/admin/ImageUploader'
import SaveButton from '@/components/admin/SaveButton'

const ICONS = ['leaf', 'pin', 'box', 'truck', 'check', 'flag']

export default function HomepageClient({ initial }) {
  const [data, setData] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const setSection = (section, k, v) => setData(d => ({ ...d, [section]: { ...d[section], [k]: v } }))

  const saveAll = async () => {
    setSaving(true); setError(''); setSaved(false)
    try {
      const pairs = [
        ['features', data.features],
        ['bestsellers_section', data.bestsellers],
        ['categories_section', data.categories],
        ['about_strip', data.about_strip],
        ['newsletter_section', data.newsletter_section],
      ]
      await Promise.all(pairs.map(([key, value]) =>
        fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value }) })
      ))
      setSaved(true); setTimeout(() => setSaved(false), 2500)
    } catch (err) { setError(err.message) }
    setSaving(false)
  }

  return (
    <div style={{ maxWidth: 780, display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Features Strip */}
      <Card title="Features Strip (4 icons under hero)">
        {(data.features || []).map((f, i) => (
          <div key={i} style={{ padding: 16, background: '#f9fafb', borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Feature {i + 1}</div>
            <Row>
              <Field label="Icon">
                <select value={f.icon} onChange={e => { const arr = [...data.features]; arr[i] = { ...arr[i], icon: e.target.value }; setData(d => ({ ...d, features: arr })) }} style={IS}>
                  {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </Field>
              <Field label="Title"><Input value={f.title} onChange={v => { const arr = [...data.features]; arr[i] = { ...arr[i], title: v }; setData(d => ({ ...d, features: arr })) }} placeholder="Feature title" /></Field>
            </Row>
            <Field label="Description"><Input value={f.text} onChange={v => { const arr = [...data.features]; arr[i] = { ...arr[i], text: v }; setData(d => ({ ...d, features: arr })) }} placeholder="Feature description" /></Field>
          </div>
        ))}
      </Card>

      {/* Bestsellers Section */}
      <Card title="Bestsellers Section">
        <Row>
          <Field label="Eyebrow"><Input value={data.bestsellers.eyebrow || ''} onChange={v => setSection('bestsellers', 'eyebrow', v)} placeholder="Trusted Favourites" /></Field>
          <Field label="Products to Show"><Input type="number" value={data.bestsellers.count || 4} onChange={v => setSection('bestsellers', 'count', parseInt(v))} placeholder="4" /></Field>
        </Row>
        <Field label="Headline"><Input value={data.bestsellers.headline || ''} onChange={v => setSection('bestsellers', 'headline', v)} placeholder="Chosen for Character" /></Field>
        <Field label="Subtext"><Input value={data.bestsellers.subtext || ''} onChange={v => setSection('bestsellers', 'subtext', v)} placeholder="Each batch is selected..." /></Field>
      </Card>

      {/* Categories */}
      <Card title="Category Cards">
        <Row>
          <Field label="Eyebrow"><Input value={data.categories.eyebrow || ''} onChange={v => setSection('categories', 'eyebrow', v)} placeholder="Browse by Type" /></Field>
          <Field label="Headline"><Input value={data.categories.headline || ''} onChange={v => setSection('categories', 'headline', v)} placeholder="Find Your Crunch" /></Field>
        </Row>
        {(data.categories.items || []).map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 14, background: '#f9fafb', borderRadius: 10 }}>
            <Field label={`Category ${i + 1} Name`}><Input value={item.name} onChange={v => { const arr = [...data.categories.items]; arr[i] = { ...arr[i], name: v }; setSection('categories', 'items', arr) }} placeholder="Roasted Nuts" /></Field>
            <Field label="Image URL"><Input value={item.img} onChange={v => { const arr = [...data.categories.items]; arr[i] = { ...arr[i], img: v }; setSection('categories', 'items', arr) }} placeholder="/img/product-1.jpg" /></Field>
          </div>
        ))}
      </Card>

      {/* About Strip */}
      <Card title="About Strip">
        <Row>
          <Field label="Eyebrow"><Input value={data.about_strip.eyebrow || ''} onChange={v => setSection('about_strip', 'eyebrow', v)} placeholder="About Us" /></Field>
          <Field label="CTA Label"><Input value={data.about_strip.cta_label || ''} onChange={v => setSection('about_strip', 'cta_label', v)} placeholder="Read Our Story" /></Field>
        </Row>
        <Field label="Headline"><Input value={data.about_strip.headline || ''} onChange={v => setSection('about_strip', 'headline', v)} placeholder="Food That Earns Its Place" /></Field>
        <Field label="Body Text"><Textarea value={data.about_strip.body || ''} onChange={v => setSection('about_strip', 'body', v)} placeholder="Across Sri Lanka..." /></Field>
        <ImageUploader value={data.about_strip.image_url || ''} onChange={v => setSection('about_strip', 'image_url', v)} folder="homepage" label="Side Image" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 10 }}>Stats (3 items)</div>
          {(data.about_strip.stats || []).map((stat, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 10 }}>
              <Field label={`Value ${i+1}`}><Input value={stat.value} onChange={v => { const arr = [...data.about_strip.stats]; arr[i] = { ...arr[i], value: v }; setSection('about_strip', 'stats', arr) }} placeholder="10K+" /></Field>
              <Field label="Label"><Input value={stat.label} onChange={v => { const arr = [...data.about_strip.stats]; arr[i] = { ...arr[i], label: v }; setSection('about_strip', 'stats', arr) }} placeholder="Homes Reached" /></Field>
            </div>
          ))}
        </div>
      </Card>

      {/* Newsletter */}
      <Card title="Newsletter Section">
        <Row>
          <Field label="Eyebrow"><Input value={data.newsletter_section.eyebrow || ''} onChange={v => setSection('newsletter_section', 'eyebrow', v)} placeholder="Stay Connected" /></Field>
          <Field label="Button Label"><Input value={data.newsletter_section.button_label || ''} onChange={v => setSection('newsletter_section', 'button_label', v)} placeholder="Subscribe" /></Field>
        </Row>
        <Field label="Headline"><Input value={data.newsletter_section.headline || ''} onChange={v => setSection('newsletter_section', 'headline', v)} placeholder="For Moments That Matter" /></Field>
        <Field label="Body Text"><Textarea value={data.newsletter_section.body || ''} onChange={v => setSection('newsletter_section', 'body', v)} placeholder="Harvest updates, new batches..." /></Field>
      </Card>

      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}
      <SaveButton loading={saving} saved={saved} onClick={saveAll} label="Save All Homepage Settings" />
    </div>
  )
}

const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
const FP = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = '#e5e7eb' }
function Card({ title, children }) { return <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div></div> }
function Row({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div> }
function Field({ label, children }) { return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div> }
function Input({ value, onChange, placeholder, type = 'text' }) { return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS} {...FP} /> }
function Textarea({ value, onChange, placeholder }) { return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...IS, resize: 'vertical' }} {...FP} /> }
