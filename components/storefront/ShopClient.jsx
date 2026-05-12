'use client'
import { useState, useMemo } from 'react'
import ProductCard from './ProductCard'
import { IconSearch } from './Icons'

export default function ShopClient({ products }) {
  const [cat, setCat] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')

  const categories = ['All', ...new Set(products.map(p => p.category))]

  const filtered = useMemo(() => {
    let p = products
      .filter(x => cat === 'All' || x.category === cat)
      .filter(x => x.name.toLowerCase().includes(search.toLowerCase()) || x.category.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'low')   p = [...p].sort((a, b) => a.price - b.price)
    if (sort === 'high')  p = [...p].sort((a, b) => b.price - a.price)
    if (sort === 'rated') p = [...p].sort((a, b) => b.rating - a.rating)
    return p
  }, [products, cat, search, sort])

  return (
    <>
      {/* Category filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {categories.map(c => (
          <button key={c} className={`pill-btn ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Search + sort */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <IconSearch size={16} color="var(--muted)" />
          </span>
          <input className="search-input" style={{ paddingLeft: 40 }} placeholder="Search products..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Default Order</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="rated">Top Rated</option>
        </select>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: 24, color: 'var(--ink)', marginBottom: 12 }}>Nothing found here</h3>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Try a different search or browse all products.</p>
          <button className="btn-outline" onClick={() => { setSearch(''); setCat('All') }}>Clear Filters</button>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          <div className="prod-grid">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </>
  )
}
