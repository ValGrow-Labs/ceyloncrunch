'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/StatusBadge'

export default function AdminProductsClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState(null)
  const router = useRouter()

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const toggleActive = async (product) => {
    const res = await fetch(`/api/products/${product.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    })
    if (res.ok) {
      setProducts(ps => ps.map(p => p.id === product.id ? { ...p, active: !p.active } : p))
    }
  }

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    setDeleting(product.id)
    await fetch(`/api/products/${product.slug}`, { method: 'DELETE' })
    setProducts(ps => ps.filter(p => p.id !== product.id))
    setDeleting(null)
  }

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      {/* Search */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 12, alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ flex: 1, padding: '9px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.target.style.borderColor = 'var(--green)'}
          onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
        <span style={{ fontSize: 13, color: '#9ca3af' }}>{filtered.length} products</span>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              {['Product', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} style={{ borderTop: '1px solid #f3f4f6' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={product.image_url || '/img/placeholder.jpg'} alt={product.name}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{product.name}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>/{product.slug}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280' }}>{product.category}</td>
                <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#111' }}>LKR {(product.price || 0).toLocaleString()}</td>
                <td style={{ padding: '14px 16px' }}>
                  <StatusBadge status={product.active ? 'active' : 'inactive'} />
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Link href={`/admin/products/${product.id}`}>
                      <button style={btnStyle('#2563eb')}>Edit</button>
                    </Link>
                    <button style={btnStyle(product.active ? '#d97706' : '#16a34a')} onClick={() => toggleActive(product)}>
                      {product.active ? 'Hide' : 'Show'}
                    </button>
                    <button style={btnStyle('#dc2626')} onClick={() => handleDelete(product)} disabled={deleting === product.id}>
                      {deleting === product.id ? '…' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                {search ? 'No products match your search' : 'No products yet — add your first one!'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const btnStyle = (color) => ({
  padding: '6px 12px', borderRadius: 8, border: 'none', fontSize: 12,
  fontWeight: 600, cursor: 'pointer', background: `${color}18`, color: color, transition: 'background 0.15s',
})
