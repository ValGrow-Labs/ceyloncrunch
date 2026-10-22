'use client'
import { useSettingsSave } from '@/components/admin/useSettingsSave'
import SaveButton from '@/components/admin/SaveButton'

const DEFAULTS = {
  green: '#1E5631', green_dark: '#163d23', green_light: '#2a7043',
  brown: '#7B3F00', gold: '#C9A84C', gold_light: '#dbc078',
  cream: '#FAF6EF', cream_dark: '#F0E8D8',
  ink: '#1a1a1a', ink_soft: '#3d3d3d', muted: '#888888', border: '#e5ddd0',
}

const COLOR_GROUPS = [
  { label: 'Green (Primary Brand)', keys: ['green', 'green_dark', 'green_light'] },
  { label: 'Brown & Gold (Accents)', keys: ['brown', 'gold', 'gold_light'] },
  { label: 'Cream (Backgrounds)', keys: ['cream', 'cream_dark'] },
  { label: 'Text & Borders', keys: ['ink', 'ink_soft', 'muted', 'border'] },
]

const LABELS = {
  green: 'Green (Primary)', green_dark: 'Green Dark', green_light: 'Green Light',
  brown: 'Brown', gold: 'Gold', gold_light: 'Gold Light',
  cream: 'Cream (BG)', cream_dark: 'Cream Dark',
  ink: 'Ink (Text)', ink_soft: 'Ink Soft', muted: 'Muted', border: 'Border',
}

export default function ThemeClient({ initial }) {
  const { value: theme, setValue: setTheme, save, saving, saved, error } = useSettingsSave('theme', { ...DEFAULTS, ...initial })

  const set = (k, v) => setTheme(t => ({ ...t, [k]: v }))
  const reset = () => setTheme(DEFAULTS)

  return (
    <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {COLOR_GROUPS.map(group => (
        <div key={group.label} style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 18, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>{group.label}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 16 }}>
            {group.keys.map(k => (
              <div key={k}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>{LABELS[k]}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: theme[k] || DEFAULTS[k], border: '2px solid #e5e7eb', cursor: 'pointer', overflow: 'hidden' }}>
                      <input type="color" value={theme[k] || DEFAULTS[k]} onChange={e => set(k, e.target.value)}
                        style={{ position: 'absolute', inset: -4, width: 'calc(100% + 8px)', height: 'calc(100% + 8px)', opacity: 0, cursor: 'pointer' }} />
                    </div>
                  </div>
                  <input type="text" value={theme[k] || ''} onChange={e => set(k, e.target.value)}
                    style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 13, fontFamily: 'monospace', outline: 'none' }}
                    onFocus={e => e.target.style.borderColor = 'var(--green)'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Preview */}
      <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f3f4f6' }}>Live Preview</h3>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: 20, borderRadius: 12, background: theme.cream || '#FAF6EF' }}>
          <button style={{ padding: '10px 22px', background: theme.green || '#1E5631', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600 }}>Primary Button</button>
          <button style={{ padding: '9px 20px', background: 'transparent', color: theme.green || '#1E5631', border: `2px solid ${theme.green || '#1E5631'}`, borderRadius: 50, fontSize: 14, fontWeight: 600 }}>Outline Button</button>
          <button style={{ padding: '10px 22px', background: theme.brown || '#7B3F00', color: '#fff', border: 'none', borderRadius: 50, fontSize: 14, fontWeight: 600 }}>Brown Button</button>
          <span style={{ padding: '5px 12px', background: theme.gold || '#C9A84C', color: '#fff', borderRadius: 50, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>New Badge</span>
          <span style={{ padding: '5px 12px', background: theme.green || '#1E5631', color: '#fff', borderRadius: 50, fontSize: 12, fontWeight: 600, textTransform: 'uppercase' }}>Bestseller</span>
        </div>
      </div>

      {error && <div style={{ padding: '12px 16px', background: '#fff0f0', border: '1px solid #fca5a5', borderRadius: 10, color: '#dc2626', fontSize: 14 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 12 }}>
        <SaveButton loading={saving} saved={saved} onClick={() => save()} />
        <button onClick={reset} style={{ padding: '11px 22px', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: 'pointer', background: 'transparent', border: '1.5px solid #e5e7eb', color: '#6b7280' }}>Reset to Defaults</button>
      </div>
    </div>
  )
}
