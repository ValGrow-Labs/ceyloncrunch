export function getLowestVariantPrice(variants = []) {
  if (!variants.length) return 0;
  return Math.min(...variants.map((v) => Number(v.price || 0)));
}

export function isProductInStock(variants = []) {
  return variants.some((v) => Number(v.stock || 0) > 0);
}

export function formatLKR(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString('en-LK')}`;
}
