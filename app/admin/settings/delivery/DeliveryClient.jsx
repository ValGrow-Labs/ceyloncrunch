'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import SaveButton from '@/components/admin/SaveButton'

export default function DeliveryClient({ initial }) {
  const { value: d, setValue: setD, save, saving, saved, error } = useSettingsSave('delivery', initial)

  const set = (k, v) => setD(x => ({ ...x, [k]: v }))
  const setZone = (i, k, v) => setD(x => { const zones = [...(x.zones || [])]; zones[i] = { ...zones[i], [k]: v }; return { ...x, zones } })
  const addZone = () => setD(x => ({ ...x, zones: [...(x.zones || []), { name: '', fee: 300, days: '2-4' }] }))
  const removeZone = (i) => setD(x => ({ ...x, zones: x.zones.filter((_, idx) => idx !== i) }))

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Card title="Free Delivery">
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
          <input type="checkbox" checked={d.free_threshold_enabled !== false} onChange={e => set('free_threshold_enabled', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
          Enable free delivery above a threshold
        </label>
        {d.free_threshold_enabled !== false && (
          <Field label="Free Delivery Threshold (LKR)">
            <Input type="number" value={d.free_threshold ?? 3000} onChange={v => set('free_threshold', parseInt(v))} placeholder="3000" />
          </Field>
        )}
      </Card>

      <Card title="Delivery Zones">
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>Customers will see the applicable zone's fee at checkout.</p>
        {(d.zones || []).map((zone, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 10, alignItems: 'end', padding: '14px', background: '#f9fafb', borderRadius: 10 }}>
            <Field label="Zone Name"><Input value={zone.name} onChange={v => setZone(i, 'name', v)} placeholder="Colombo & Suburbs" /></Field>
            <Field label="Fee (LKR)"><Input type="number" value={zone.fee} onChange={v => setZone(i, 'fee', parseInt(v))} placeholder="300" /></Field>
            <Field label="Est. Days"><Input value={zone.days} onChange={v => setZone(i, 'days', v)} placeholder="1-2" /></Field>
            <button onClick={() => removeZone(i)} style={{ padding: '10px 12px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, alignSelf: 'flex-end' }}>✕</button>
          </div>
        ))}
        <button onClick={addZone}
          style={{ padding: '10px 18px', background: '#f0f7f2', color: 'var(--green)', border: '1.5px dashed var(--green)', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, width: '100%' }}>
          + Add Delivery Zone
        </button>
      </Card>

      <Card title="Dispatch & COD">
        <Field label="Estimated Dispatch Time">
          <Input value={d.estimated_dispatch || ''} onChange={v => set('estimated_dispatch', v)} placeholder="1 business day" />
        </Field>
        <Field label="COD Extra Fee (LKR, 0 = none)">
          <Input type="number" value={d.cod_extra_fee ?? 0} onChange={v => set('cod_extra_fee', parseInt(v))} placeholder="0" />
        </Field>
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
function ErrBox({ children }) { return <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{children}</div> }
