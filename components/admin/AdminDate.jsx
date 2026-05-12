'use client'
export default function AdminDate() {
  return (
    <span style={{ fontSize: 13, color: '#9ca3af' }}>
      {new Date().toLocaleDateString('en-LK', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
  )
}
