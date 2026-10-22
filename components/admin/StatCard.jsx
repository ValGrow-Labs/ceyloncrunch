export default function StatCard({ label, value, sub, icon, color = 'var(--green)', trend }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#111', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>{value}</div>
        {(sub || trend != null) && (
          <div style={{ fontSize: 13, color: trend > 0 ? '#16a34a' : trend < 0 ? '#dc2626' : '#9ca3af', marginTop: 6 }}>
            {trend != null && <span style={{ marginRight: 4 }}>{trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {Math.abs(trend)}% vs last month</span>}
            {sub && <span style={{ color: '#9ca3af' }}>{sub}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
