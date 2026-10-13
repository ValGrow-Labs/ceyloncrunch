'use client'
import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductCard from './ProductCard'
import { IconSearch, IconX } from './Icons'

const CATEGORIES = [
  'All Products',
  'Nuts',
  'Dried Fruits',
  'Dates',
  'Seeds',
  'Spices',
  'Healthy Snacks',
  'Honey',
  'Tea & Coffee',
  'Chocolates',
  'Gift Items',
  'Other Products',
]

const CATEGORY_META = {
  'All Products': {
    eyebrow: 'SHOP',
    heading: 'OUR COLLECTION',
    subheading: 'Quality, Made Simple.',
    desc: 'Explore our full range of carefully selected products.',
  },
  'Nuts': {
    eyebrow: 'SHOP / NUTS',
    heading: 'Quality Nuts for Every Day.',
    subheading: 'Carefully Sourced & Roasted',
    desc: 'Choose from a selection of nuts in different varieties, sizes and flavours.',
  },
  'Dried Fruits': {
    eyebrow: 'SHOP / DRIED FRUITS',
    heading: 'Naturally Sweet Options.',
    subheading: 'Pure & Wholesome',
    desc: 'Naturally sweet options for everyday snacking.',
  },
  'Dates': {
    eyebrow: 'SHOP / DATES',
    heading: 'Dates',
    subheading: 'Naturally Sweet & Wholesome',
    desc: 'Soft, naturally sweet and perfect for sharing.',
  },
  'Seeds': {
    eyebrow: 'SHOP / SEEDS',
    heading: 'Seeds',
    subheading: 'Wholesome Everyday Essentials',
    desc: 'Simple ingredients for snacks, meals and recipes.',
  },
  'Spices': {
    eyebrow: 'SHOP / SPICES',
    heading: 'Spices',
    subheading: 'Authentic Island Character',
    desc: 'Aromatic spices and roasted seasoned snacks with honest heat.',
  },
  'Healthy Snacks': {
    eyebrow: 'SHOP / HEALTHY SNACKS',
    heading: 'Healthy Snacks',
    subheading: 'Wholesome Crunch',
    desc: 'Convenient choices for busy days.',
  },
  'Honey': {
    eyebrow: 'SHOP / HONEY',
    heading: 'Honey',
    subheading: 'Pure & Natural',
    desc: 'Pure wildflower honey and honey-glazed nuts crafted with care.',
  },
  'Tea & Coffee': {
    eyebrow: 'SHOP / TEA & COFFEE',
    heading: 'Tea & Coffee',
    subheading: 'Highland Blends',
    desc: 'Authentic Sri Lankan brews and artisanal beverage accompaniments.',
  },
  'Chocolates': {
    eyebrow: 'SHOP / CHOCOLATES',
    heading: 'Chocolates',
    subheading: 'Dark Chocolate Enrobed Treats',
    desc: 'Rich 72% dark chocolate paired with freshly roasted nuts.',
  },
  'Gift Items': {
    eyebrow: 'SHOP / GIFT ITEMS',
    heading: 'Gifts & Hampers',
    subheading: 'Something Worth Sharing',
    desc: 'Thoughtful options for every celebration and occasion.',
  },
  'Other Products': {
    eyebrow: 'SHOP / OTHER PRODUCTS',
    heading: 'Other Products',
    subheading: 'Specialty Additions',
    desc: 'Explore more unique and seasonal choices from our kitchen.',
  },
}

function matchesCategory(product, cat) {
  if (!cat || cat === 'All Products' || cat === 'All') return true

  const name = (product.name || '').toLowerCase()
  const pCat = (product.category || '').toLowerCase()
  const desc = (product.description || '').toLowerCase()

  switch (cat) {
    case 'Nuts':
      return pCat.includes('nut') || name.includes('cashew') || name.includes('almond') ||
             name.includes('walnut') || name.includes('pistachio') || name.includes('macadamia') ||
             name.includes('peanut')
    case 'Dried Fruits':
      return pCat.includes('fruit') || name.includes('coconut') || name.includes('trail') ||
             desc.includes('fruit') || desc.includes('coconut') || desc.includes('berries')
    case 'Dates':
      return name.includes('date') || name.includes('energy bite') || desc.includes('date')
    case 'Seeds':
      return name.includes('seed') || name.includes('trail') || name.includes('energy bite') ||
             name.includes('superfood') || desc.includes('seed') || desc.includes('pumpkin')
    case 'Spices':
      return name.includes('masala') || name.includes('spice') || name.includes('spicy') ||
             desc.includes('masala') || desc.includes('spice')
    case 'Healthy Snacks':
      return pCat.includes('snack') || pCat.includes('trail') || name.includes('bites') ||
             name.includes('chips') || name.includes('peanuts')
    case 'Honey':
      return name.includes('honey') || desc.includes('honey')
    case 'Tea & Coffee':
      return name.includes('tea') || name.includes('coffee') || desc.includes('tea') || desc.includes('coffee')
    case 'Chocolates':
      return name.includes('choc') || name.includes('chocolate') || desc.includes('chocolate')
    case 'Gift Items':
      return name.includes('trail') || name.includes('superfood') || product.badge === 'Bestseller' ||
             product.badge === 'Premium' || pCat.includes('trail')
    case 'Other Products':
      return !pCat.includes('nut') && !pCat.includes('snack')
    default: {
      const target = cat.toLowerCase()
      return pCat === target || pCat.includes(target) || target.includes(pCat) || name.includes(target)
    }
  }
}

function ShopInner({ products }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Initialize from search params
  const rawParamCategory = searchParams.get('category') || 'All Products'
  const matchedCategory = CATEGORIES.find(c => c.toLowerCase() === rawParamCategory.toLowerCase()) ||
    (rawParamCategory.toLowerCase() === 'all' ? 'All Products' : rawParamCategory)
  const paramSearch = searchParams.get('search') || ''

  const [category, setCategory] = useState(matchedCategory)
  const [search, setSearch] = useState(paramSearch)
  const [priceRange, setPriceRange] = useState('all')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sort, setSort] = useState('default')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // React to URL search param updates
  useEffect(() => {
    const qCat = searchParams.get('category')
    const qSearch = searchParams.get('search')

    if (qCat) {
      const match = CATEGORIES.find(c => c.toLowerCase() === qCat.toLowerCase())
      setCategory(match || qCat)
    }
    if (qSearch !== null && qSearch !== undefined) {
      setSearch(qSearch)
    }
  }, [searchParams])

  // Count active filters (excluding default values)
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (category !== 'All Products') count++
    if (priceRange !== 'all') count++
    if (sizeFilter !== 'all') count++
    if (availability !== 'all') count++
    if (ratingFilter !== 'all') count++
    if (search.trim()) count++
    return count
  }, [category, priceRange, sizeFilter, availability, ratingFilter, search])

  // Reset all filters
  const resetAllFilters = () => {
    setCategory('All Products')
    setSearch('')
    setPriceRange('all')
    setSizeFilter('all')
    setAvailability('all')
    setRatingFilter('all')
    setSort('default')
    router.replace('/shop', { scroll: false })
  }

  // Calculate product counts per category
  const categoryCounts = useMemo(() => {
    const counts = {}
    CATEGORIES.forEach(c => {
      counts[c] = products.filter(p => matchesCategory(p, c)).length
    })
    return counts
  }, [products])

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => matchesCategory(p, category))

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase().trim()
      list = list.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      )
    }

    // Price range filter
    if (priceRange === 'under-1000') {
      list = list.filter(p => p.price < 1000)
    } else if (priceRange === '1000-2000') {
      list = list.filter(p => p.price >= 1000 && p.price <= 2000)
    } else if (priceRange === 'above-2000') {
      list = list.filter(p => p.price > 2000)
    }

    // Size filter
    if (sizeFilter !== 'all') {
      list = list.filter(p => {
        const variants = p.variants || []
        return variants.some(v => {
          const s = (typeof v === 'string' ? v : v.size || '').toLowerCase()
          return s === sizeFilter.toLowerCase()
        })
      })
    }

    // Availability filter
    if (availability === 'in-stock') {
      list = list.filter(p => p.active !== false && p.in_stock !== false)
    }

    // Rating filter
    if (ratingFilter === '4.5+') {
      list = list.filter(p => (p.rating || 0) >= 4.5)
    } else if (ratingFilter === '4.8+') {
      list = list.filter(p => (p.rating || 0) >= 4.8)
    }

    // Sorting
    if (sort === 'low') {
      list = [...list].sort((a, b) => a.price - b.price)
    } else if (sort === 'high') {
      list = [...list].sort((a, b) => b.price - a.price)
    } else if (sort === 'rated') {
      list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    }

    return list
  }, [products, category, search, priceRange, sizeFilter, availability, ratingFilter, sort])

  // Get active meta for current category
  const meta = CATEGORY_META[category] || {
    eyebrow: `SHOP / ${category.toUpperCase()}`,
    heading: category,
    subheading: 'Quality, Made Simple.',
    desc: `Browse our selection of ${category.toLowerCase()}.`,
  }

  return (
    <div>
      {/* ═══════════════════════════════════════════════
          1. DYNAMIC CATEGORY HEADER & PROMINENT SEARCH
      ═══════════════════════════════════════════════ */}
      <div style={{ marginBottom: 40 }}>
        {/* Breadcrumb / Section label */}
        <p style={{
          fontSize: 12,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--brown)',
          fontWeight: 700,
          marginBottom: 8,
        }}>
          {meta.eyebrow}
        </p>

        {/* Dynamic Main Heading */}
        <h1 style={{
          fontFamily: 'Playfair Display,serif',
          fontSize: 'clamp(28px,4.5vw,48px)',
          fontWeight: 700,
          color: 'var(--green-dark)',
          lineHeight: 1.15,
          marginBottom: 10,
        }}>
          {meta.heading}
        </h1>

        {/* Supporting Text & Description */}
        <p style={{
          fontSize: 17,
          color: 'var(--green)',
          fontWeight: 600,
          marginBottom: 6,
        }}>
          {meta.subheading}
        </p>
        <p style={{
          fontSize: 15,
          color: 'var(--ink-soft)',
          maxWidth: 620,
          lineHeight: 1.7,
          marginBottom: 28,
        }}>
          {meta.desc}
        </p>

        {/* Prominent Search Bar */}
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <span style={{
            position: 'absolute',
            left: 18,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
          }}>
            <IconSearch size={20} color="var(--muted)" />
          </span>
          <input
            type="text"
            className="search-input"
            style={{
              padding: '15px 48px 15px 50px',
              borderRadius: 50,
              border: '1.5px solid var(--border)',
              background: '#fff',
              fontSize: 15,
              outline: 'none',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              width: '100%',
            }}
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted)',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
              }}
              title="Clear search"
            >
              <IconX size={16} color="var(--muted)" />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          2. HORIZONTAL CATEGORY NAVIGATION BAR
      ═══════════════════════════════════════════════ */}
      <div style={{
        marginBottom: 32,
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        paddingBottom: 8,
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        <div style={{ display: 'inline-flex', gap: 10 }}>
          {CATEGORIES.map(c => {
            const isSelected = category === c
            const count = categoryCounts[c] ?? 0
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 50,
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? '#fff' : 'var(--ink-soft)',
                  background: isSelected ? 'var(--green)' : '#fff',
                  border: isSelected ? '1.5px solid var(--green)' : '1.5px solid var(--border)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 14px rgba(30,86,49,0.2)' : 'none',
                }}
              >
                <span>{c}</span>
                <span style={{
                  fontSize: 11,
                  padding: '1px 6px',
                  borderRadius: 20,
                  background: isSelected ? 'rgba(255,255,255,0.22)' : 'var(--cream-dark)',
                  color: isSelected ? '#fff' : 'var(--muted)',
                  fontWeight: 600,
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          3. MAIN LAYOUT: SIDEBAR FILTERS + PRODUCT GRID
      ═══════════════════════════════════════════════ */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        gap: 36,
        alignItems: 'start',
      }} className="shop-layout-grid">

        {/* ── DESKTOP FILTERS SIDEBAR ── */}
        <aside className="hide-mobile" style={{
          background: '#fff',
          borderRadius: 20,
          border: '1px solid var(--border)',
          padding: '24px 22px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 16,
            marginBottom: 20,
            borderBottom: '1px solid var(--border)',
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--green-dark)', letterSpacing: '0.04em' }}>
              Filters
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                style={{ fontSize: 12, color: 'var(--brown)', fontWeight: 600, cursor: 'pointer' }}
              >
                Reset All ({activeFilterCount})
              </button>
            )}
          </div>

          {/* Price Range Filter */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Price Range
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under-1000', label: 'Under Rs. 1,000' },
                { id: '1000-2000', label: 'Rs. 1,000 – Rs. 2,000' },
                { id: 'above-2000', label: 'Above Rs. 2,000' },
              ].map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="priceRangeDesktop"
                    checked={priceRange === opt.id}
                    onChange={() => setPriceRange(opt.id)}
                    style={{ accentColor: 'var(--green)' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div style={{ marginBottom: 24, paddingTop: 18, borderTop: '1px solid var(--cream-dark)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Pack Size
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['all', '100g', '200g', '250g', '500g', '1KG'].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSizeFilter(s)}
                  className={`pill-btn ${sizeFilter === s ? 'active' : ''}`}
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: sizeFilter === s ? 600 : 500,
                  }}
                >
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Filter */}
          <div style={{ marginBottom: 24, paddingTop: 18, borderTop: '1px solid var(--cream-dark)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Availability
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'all', label: 'All Items' },
                { id: 'in-stock', label: 'In Stock Only' },
              ].map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="availDesktop"
                    checked={availability === opt.id}
                    onChange={() => setAvailability(opt.id)}
                    style={{ accentColor: 'var(--green)' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div style={{ paddingTop: 18, borderTop: '1px solid var(--cream-dark)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Rating
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'all', label: 'All Ratings' },
                { id: '4.5+', label: '4.5★ & Above' },
                { id: '4.8+', label: '4.8★ & Above' },
              ].map(opt => (
                <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--ink-soft)', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="ratingDesktop"
                    checked={ratingFilter === opt.id}
                    onChange={() => setRatingFilter(opt.id)}
                    style={{ accentColor: 'var(--green)' }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT (CONTROLS & PRODUCT GRID) ── */}
        <div>
          {/* Controls bar: Results count, active filter tags, sort, and mobile filter toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}>
            {/* Left: Count & Mobile Filter Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Mobile Filter Button */}
              <button
                className="show-mobile-only"
                onClick={() => setMobileFilterOpen(true)}
                style={{
                  padding: '9px 18px',
                  borderRadius: 50,
                  background: 'var(--green)',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>Filters & Sort</span>
                {activeFilterCount > 0 && (
                  <span style={{
                    background: '#fff',
                    color: 'var(--green)',
                    fontSize: 11,
                    fontWeight: 700,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <span style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 500 }}>
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
              </span>
            </div>

            {/* Right: Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--muted)' }} className="hide-mobile">Sort by:</span>
              <select
                className="sort-select"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ padding: '8px 14px', fontSize: 13 }}
              >
                <option value="default">Default Order</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="rated">Top Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {activeFilterCount > 0 && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Active:
              </span>

              {category !== 'All Products' && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 50,
                  background: 'var(--cream-dark)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--green-dark)',
                }}>
                  Category: {category}
                  <button onClick={() => setCategory('All Products')} style={{ cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                </span>
              )}

              {search && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 50,
                  background: 'var(--cream-dark)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--green-dark)',
                }}>
                  Search: &quot;{search}&quot;
                  <button onClick={() => setSearch('')} style={{ cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                </span>
              )}

              {priceRange !== 'all' && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 50,
                  background: 'var(--cream-dark)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--green-dark)',
                }}>
                  Price: {priceRange === 'under-1000' ? '< Rs. 1,000' : priceRange === '1000-2000' ? 'Rs. 1k–2k' : '> Rs. 2,000'}
                  <button onClick={() => setPriceRange('all')} style={{ cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                </span>
              )}

              {sizeFilter !== 'all' && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 50,
                  background: 'var(--cream-dark)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--green-dark)',
                }}>
                  Size: {sizeFilter}
                  <button onClick={() => setSizeFilter('all')} style={{ cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                </span>
              )}

              {availability !== 'all' && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 50,
                  background: 'var(--cream-dark)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--green-dark)',
                }}>
                  In Stock Only
                  <button onClick={() => setAvailability('all')} style={{ cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                </span>
              )}

              {ratingFilter !== 'all' && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 12px',
                  borderRadius: 50,
                  background: 'var(--cream-dark)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'var(--green-dark)',
                }}>
                  Rating: {ratingFilter}★
                  <button onClick={() => setRatingFilter('all')} style={{ cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
                </span>
              )}

              <button
                onClick={resetAllFilters}
                style={{
                  fontSize: 12,
                  color: 'var(--brown)',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  marginLeft: 4,
                  fontWeight: 600,
                }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              4. PRODUCT GRID OR EMPTY STATE
          ═══════════════════════════════════════════════ */}
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div style={{
              textAlign: 'center',
              padding: '80px 24px',
              background: '#fff',
              borderRadius: 24,
              border: '1px solid var(--border)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>🍂</div>
              <h3 style={{
                fontFamily: 'Playfair Display,serif',
                fontSize: 26,
                fontWeight: 700,
                color: 'var(--green-dark)',
                marginBottom: 10,
              }}>
                No products found.
              </h3>
              <p style={{
                fontSize: 15,
                color: 'var(--muted)',
                maxWidth: 440,
                margin: '0 auto 28px',
                lineHeight: 1.6,
              }}>
                Try another search or browse all products.
              </p>
              <button
                className="btn-primary"
                onClick={resetAllFilters}
                style={{ padding: '12px 32px', fontSize: 14 }}
              >
                Browse All Products
              </button>
            </div>
          ) : (
            /* Responsive Product Grid */
            <div className="prod-grid" style={{ gap: 24 }}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          5. MOBILE FILTERS DRAWER / MODAL
      ═══════════════════════════════════════════════ */}
      {mobileFilterOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(0,0,0,0.45)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}>
          <div style={{
            width: '100%',
            maxWidth: 360,
            height: '100%',
            background: 'var(--cream)',
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: 16,
              marginBottom: 20,
              borderBottom: '1px solid var(--border)',
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--green-dark)' }}>
                Filters & Sort
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                style={{ padding: 6, cursor: 'pointer' }}
                aria-label="Close filters"
              >
                <IconX size={22} color="var(--ink)" />
              </button>
            </div>

            {/* Mobile Category Selection */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 10 }}>
                Category
              </div>
              <select
                className="sort-select"
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 14px' }}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c} ({categoryCounts[c] ?? 0})</option>
                ))}
              </select>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 10 }}>
                Price Range
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under-1000', label: 'Under Rs. 1,000' },
                  { id: '1000-2000', label: 'Rs. 1,000 – Rs. 2,000' },
                  { id: 'above-2000', label: 'Above Rs. 2,000' },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <input
                      type="radio"
                      name="priceRangeMobile"
                      checked={priceRange === opt.id}
                      onChange={() => setPriceRange(opt.id)}
                      style={{ accentColor: 'var(--green)' }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 10 }}>
                Pack Size
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['all', '100g', '200g', '250g', '500g', '1KG'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSizeFilter(s)}
                    className={`pill-btn ${sizeFilter === s ? 'active' : ''}`}
                    style={{ padding: '6px 14px', fontSize: 13 }}
                  >
                    {s === 'all' ? 'All' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 10 }}>
                Availability
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { id: 'all', label: 'All Items' },
                  { id: 'in-stock', label: 'In Stock Only' },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <input
                      type="radio"
                      name="availMobile"
                      checked={availability === opt.id}
                      onChange={() => setAvailability(opt.id)}
                      style={{ accentColor: 'var(--green)' }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', marginBottom: 10 }}>
                Rating
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { id: 'all', label: 'All Ratings' },
                  { id: '4.5+', label: '4.5★ & Above' },
                  { id: '4.8+', label: '4.8★ & Above' },
                ].map(opt => (
                  <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                    <input
                      type="radio"
                      name="ratingMobile"
                      checked={ratingFilter === opt.id}
                      onChange={() => setRatingFilter(opt.id)}
                      style={{ accentColor: 'var(--green)' }}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Drawer Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: 10, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <button
                className="btn-outline"
                onClick={resetAllFilters}
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              >
                Reset
              </button>
              <button
                className="btn-primary"
                onClick={() => setMobileFilterOpen(false)}
                style={{ flex: 1, justifyContent: 'center', padding: '12px' }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive layout CSS overrides */}
      <style>{`
        @media (max-width: 900px) {
          .shop-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function ShopClient({ products }) {
  return (
    <Suspense fallback={
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="spinner-dark" />
      </div>
    }>
      <ShopInner products={products} />
    </Suspense>
  )
}
