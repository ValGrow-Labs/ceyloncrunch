'use client'
export default function SaveButton({ loading, saved, onClick, label = 'Save Changes' }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{
        padding: '11px 28px', borderRadius: 50, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        background: saved ? '#16a34a' : 'var(--green)', color: '#fff', border: 'none',
        display: 'inline-flex', alignItems: 'center', gap: 8, transition: 'background 0.2s',
        opacity: loading ? 0.7 : 1,
      }}>
      {loading
        ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Saving...</>
        : saved ? '✓ Saved' : label}
    </button>
  )
}
