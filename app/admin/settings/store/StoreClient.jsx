'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import SaveButton from '@/components/admin/SaveButton'

export default function StoreClient({ initial }) {
  const { value: s, setValue: setS, save, saving, saved, error } = useSettingsSave('store', initial)
  const set = (k, v) => setS(x => ({ ...x, [k]: v }))

  return (
    <div style={{ maxWidth: 520, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card title="Currency">
        <Row>
          <Field label="Currency Code"><Input value={s.currency || ''} onChange={v => set('currency', v)} placeholder="LKR" /></Field>
          <Field label="Currency Symbol"><Input value={s.currency_symbol || ''} onChange={v => set('currency_symbol', v)} placeholder="LKR" /></Field>
        </Row>
      </Card>
      <Card title="Order Settings">
        <Field label="Minimum Order (LKR, 0 = no minimum)"><Input type="number" value={s.min_order ?? 0} onChange={v => set('min_order', parseInt(v))} placeholder="0" /></Field>
        <Field label="Tax Rate (%, 0 = no tax)"><Input type="number" value={s.tax_rate ?? 0} onChange={v => set('tax_rate', parseFloat(v))} placeholder="0" /></Field>
      </Card>
      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}
const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
const FP = { onFocus: e => e.target.style.borderColor = 'var(--green)', onBlur: e => e.target.style.borderColor = '#e5e7eb' }
function Card({ title, children }) { return <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}><h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{title}</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div></div> }
function Row({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div> }
function Field({ label, children }) { return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div> }
function Input({ value, onChange, placeholder, type = 'text' }) { return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS} {...FP} /> }
