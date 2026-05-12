'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import SaveButton from '@/components/admin/SaveButton'

export default function PaymentsClient({ initial }) {
  const { value: p, setValue: setP, save, saving, saved, error } = useSettingsSave('payments', initial)

  const set = (method, key, val) => setP(x => ({ ...x, [method]: { ...x[method], [key]: val } }))

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Cash on Delivery */}
      <MethodCard title="Cash on Delivery" icon="💵" enabled={p.cod?.enabled} onToggle={v => set('cod', 'enabled', v)}>
        <Field label="Display Label"><Input value={p.cod?.label || ''} onChange={v => set('cod', 'label', v)} placeholder="Cash on Delivery" /></Field>
        <Field label="Description (shown to customer)"><Input value={p.cod?.description || ''} onChange={v => set('cod', 'description', v)} placeholder="Pay cash when your order arrives" /></Field>
        <Field label="Extra Fee (LKR, 0 = none)"><Input type="number" value={p.cod?.extra_fee ?? 0} onChange={v => set('cod', 'extra_fee', parseInt(v))} placeholder="0" /></Field>
      </MethodCard>

      {/* Bank Transfer */}
      <MethodCard title="Bank Transfer" icon="🏦" enabled={p.bank_transfer?.enabled} onToggle={v => set('bank_transfer', 'enabled', v)}>
        <Field label="Display Label"><Input value={p.bank_transfer?.label || ''} onChange={v => set('bank_transfer', 'label', v)} placeholder="Bank Transfer" /></Field>
        <Field label="Description"><Input value={p.bank_transfer?.description || ''} onChange={v => set('bank_transfer', 'description', v)} placeholder="Transfer to our bank account" /></Field>
        <Row>
          <Field label="Bank Name"><Input value={p.bank_transfer?.bank_name || ''} onChange={v => set('bank_transfer', 'bank_name', v)} placeholder="Bank of Ceylon" /></Field>
          <Field label="Account Name"><Input value={p.bank_transfer?.account_name || ''} onChange={v => set('bank_transfer', 'account_name', v)} placeholder="Ceylon Crunch (Pvt) Ltd" /></Field>
        </Row>
        <Row>
          <Field label="Account Number"><Input value={p.bank_transfer?.account_number || ''} onChange={v => set('bank_transfer', 'account_number', v)} placeholder="0000000000" /></Field>
          <Field label="Branch"><Input value={p.bank_transfer?.branch || ''} onChange={v => set('bank_transfer', 'branch', v)} placeholder="Colombo" /></Field>
        </Row>
        <Field label="Customer Instructions">
          <textarea value={p.bank_transfer?.instructions || ''} onChange={e => set('bank_transfer', 'instructions', e.target.value)} rows={3}
            placeholder="Please transfer the exact amount and WhatsApp the slip..."
            style={{ ...IS, resize: 'vertical' }}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
        </Field>
      </MethodCard>

      {/* PayHere */}
      <MethodCard title="PayHere (Online Payment)" icon="💳" enabled={p.payhere?.enabled} onToggle={v => set('payhere', 'enabled', v)}>
        <Field label="Display Label"><Input value={p.payhere?.label || ''} onChange={v => set('payhere', 'label', v)} placeholder="Pay Online" /></Field>
        <Field label="Description"><Input value={p.payhere?.description || ''} onChange={v => set('payhere', 'description', v)} placeholder="Credit/Debit card via PayHere" /></Field>
        <Row>
          <Field label="Merchant ID"><Input value={p.payhere?.merchant_id || ''} onChange={v => set('payhere', 'merchant_id', v)} placeholder="PayHere Merchant ID" /></Field>
          <Field label="Secret Key"><Input type="password" value={p.payhere?.secret || ''} onChange={v => set('payhere', 'secret', v)} placeholder="••••••••••••" /></Field>
        </Row>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#374151' }}>
          <input type="checkbox" checked={p.payhere?.sandbox !== false} onChange={e => set('payhere', 'sandbox', e.target.checked)}
            style={{ width: 16, height: 16, accentColor: 'var(--green)' }} />
          Use Sandbox Mode (for testing — disable in production)
        </label>
        {p.payhere?.sandbox !== false && (
          <div style={{ padding: '10px 14px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, fontSize: 13, color: '#92400e' }}>
            ⚠ Sandbox mode is ON. Switch off when going live.
          </div>
        )}
      </MethodCard>

      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}
      <SaveButton loading={saving} saved={saved} onClick={() => save()} />
    </div>
  )
}

function MethodCard({ title, icon, enabled, onToggle, children }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid #f3f4f6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 22 }}>{icon}</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#111' }}>{title}</span>
        </div>
        <Toggle enabled={enabled} onToggle={onToggle} />
      </div>
      {enabled && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{children}</div>}
      {!enabled && <p style={{ fontSize: 13, color: '#9ca3af' }}>This payment method is disabled and won't be shown to customers.</p>}
    </div>
  )
}
function Toggle({ enabled, onToggle }) {
  return (
    <button onClick={() => onToggle(!enabled)} style={{ width: 44, height: 24, borderRadius: 50, border: 'none', cursor: 'pointer', background: enabled ? 'var(--green)' : '#e5e7eb', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: 3, left: enabled ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </button>
  )
}
const IS = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', transition: 'border-color 0.2s', fontFamily: 'inherit' }
function Field({ label, children }) { return <div><label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>{children}</div> }
function Row({ children }) { return <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>{children}</div> }
function Input({ value, onChange, placeholder, type = 'text' }) { return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={IS} onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} /> }
