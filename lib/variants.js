// Normalize product.variants to a uniform [{size, price}] shape.
// Supports legacy ["250g","500g"] format by falling back to product.price.
export function normalizeVariants(product) {
  const raw = product?.variants || []
  if (!Array.isArray(raw)) return []
  return raw.map(v => {
    if (typeof v === 'string') return { size: v, price: product.price }
    return { size: v.size, price: v.price ?? product.price }
  })
}

export function variantPriceFor(product, size) {
  const list = normalizeVariants(product)
  if (!list.length) return product.price
  const match = list.find(v => v.size === size)
  return match ? match.price : product.price
}

export function defaultVariant(product) {
  const list = normalizeVariants(product)
  return list[0] || null
}

export function priceRange(product) {
  const list = normalizeVariants(product)
  if (!list.length) return { min: product.price, max: product.price }
  const prices = list.map(v => v.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}
