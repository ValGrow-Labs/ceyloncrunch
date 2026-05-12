'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ImageUploader from './ImageUploader'
import SaveButton from './SaveButton'

const CATEGORIES = ['Roasted Nuts', 'Raw Nuts', 'Mixed Trails', 'Specialty Snacks']
const BADGE_TYPES = [{ value: '', label: 'None' }, { value: 'green', label: 'Green (Bestseller)' }, { value: 'gold', label: 'Gold (New/Popular)' }, { value: 'brown', label: 'Brown (Premium)' }, { value: 'red', label: 'Red (Hot/Sale)' }]

export default function ProductForm({ initial = {} }) {
  const router = useRouter()
  const isEdit = !!initial.id
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [variantInput, setVariantInput] = useState('')

  const [form, setForm] = useState({
    name: initial.name || '',
    slug: initial.slug || '',
    category: initial.category || CATEGORIES[0],
    price: initial.price || '',
    variants: initial.variants || [],
    badge: initial.badge || '',
    badge_type: initial.badge_type || '',
    rating: initial.rating || 4.5,
    reviews: initial.reviews || 0,
    image_url: initial.image_url || '',
    description: initial.description || '',
    active: initial.active !== false,
    nutrition_info: initial.nutrition_info || { serving: '30g', calories: '', fat: '', protein: '', carbs: '', fibre: '', sodium: '' },
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const setNutrition = (k, v) => setForm(f => ({ ...f, nutrition_info: { ...f.nutrition_info, [k]: v } }))

  const autoSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const addVariant = () => {
    const v = variantInput.trim()
    if (v && !form.variants.includes(v)) {
      set('variants', [...form.variants, v])
      setVariantInput('')
    }
  }

  const handleSubmit = async (e) => {
    e?.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, price: parseInt(form.price), rating: parseFloat(form.rating), reviews: parseInt(form.reviews) }
      let res
      if (isEdit) {
        res = await fetch(`/api/products/${initial.slug}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      } else {
        res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      }
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      setSaved(true)
      setTimeout(() => { router.push('/admin/products'); router.refresh() }, 800)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      {/* Basic info */}
      <Section title="Basic Info">
        <Row>
          <Field label="Product Name *">
            <input value={form.name} onChange={e => { set('name', e.target.value); if (!isEdit) set('slug', autoSlug(e.target.value)) }} required style={inputStyle} placeholder="e.g. Roasted Cashews" {...focusProps} />
          </Field>
          <Field label="Slug *">
            <input value={form.slug} onChange={e => set('slug', e.target.value)} required style={inputStyle} placeholder="e.g. roasted-cashews" {...focusProps} />
          </Field>
        </Row>
        <Row>
          <Field label="Category">
            <select value={form.category} onChange={e => set('category', e.target.value)} style={inputStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Price (LKR) *">
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} required min={0} style={inputStyle} placeholder="1200" {...focusProps} />
          </Field>
        </Row>
        <Field label="Description">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Describe the product..." {...focusProps} />
        </Field>
      </Section>

      {/* Image */}
      <Section title="Product Image">
        <ImageUploader value={form.image_url} onChange={v => set('image_url', v)} folder="products" label="Product Image" />
      </Section>

      {/* Variants */}
      <Section title="Variants (Weight Options)">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {form.variants.map(v => (
            <span key={v} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#f0f7f2', border: '1px solid var(--green)', borderRadius: 50, fontSize: 13, color: 'var(--green)', fontWeight: 500 }}>
              {v}
              <button type="button" onClick={() => set('variants', form.variants.filter(x => x !== v))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 14, lineHeight: 1 }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={variantInput} onChange={e => setVariantInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVariant() } }}
            placeholder="e.g. 250g, 500g, 1kg" style={{ ...inputStyle, flex: 1 }} {...focusProps} />
          <button type="button" onClick={addVariant} style={{ padding: '10px 18px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontWeight: 600 }}>Add</button>
        </div>
      </Section>

      {/* Badge & visibility */}
      <Section title="Badge & Visibility">
        <Row>
          <Field label="Badge Text">
            <input value={form.badge} onChange={e => set('badge', e.target.value)} style={inputStyle} placeholder="e.g. Bestseller" {...focusProps} />
          </Field>
          <Field label="Badge Colour">
            <select value={form.badge_type} onChange={e => set('badge_type', e.target.value)} style={inputStyle}>
              {BADGE_TYPES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </Field>
        </Row>
        <Row>
          <Field label="Rating (0–5)">
            <input type="number" value={form.rating} onChange={e => set('rating', e.target.value)} min={0} max={5} step={0.1} style={inputStyle} {...focusProps} />
          </Field>
          <Field label="Review Count">
            <input type="number" value={form.reviews} onChange={e => set('reviews', e.target.value)} min={0} style={inputStyle} {...focusProps} />
          </Field>
        </Row>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
          <input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
          Active (visible on store)
        </label>
      </Section>

      {/* Nutrition */}
      <Section title="Nutrition Info (per serving)">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px,1fr))', gap: 12 }}>
          {[['serving', 'Serving Size'], ['calories', 'Calories'], ['fat', 'Total Fat'], ['protein', 'Protein'], ['carbs', 'Carbohydrates'], ['fibre', 'Fibre'], ['sodium', 'Sodium']].map(([k, label]) => (
            <Field key={k} label={label}>
              <input value={form.nutrition_info[k] || ''} onChange={e => setNutrition(k, e.target.value)} style={inputStyle} placeholder={k === 'serving' ? '30g' : 'e.g. 14g'} {...focusProps} />
            </Field>
          ))}
        </div>
      </Section>

      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 12 }}>
        <SaveButton loading={saving} saved={saved} onClick={handleSubmit} label={isEdit ? 'Save Changes' : 'Create Product'} />
        <button type="button" onClick={() => router.back()}
          style={{ padding: '11px 22px', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'transparent', border: '1.5px solid #e5e7eb', color: '#6b7280' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit', background: '#fff' }
const focusProps = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = '#e5e7eb' }

function Section({ title, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
    </div>
  )
}
function Row({ children }) {
  return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>{children}</div>
}
function Field({ label, children }) {
  return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div>
}
