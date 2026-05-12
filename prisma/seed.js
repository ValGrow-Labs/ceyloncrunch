import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    slug: 'roasted-cashews',
    name: 'Roasted Cashews',
    category: 'Roasted Nuts',
    price: 1200,
    variants: JSON.stringify(['250g', '500g', '1kg']),
    badge: 'Bestseller',
    badgeType: 'green',
    rating: 4.8,
    reviews: 142,
    image: '/img/product-1.jpg',
    description: 'Golden-roasted to perfection, our cashews are slow-roasted in small batches over measured heat, drawing out the deep nuttiness while preserving the natural sweetness of the kernel. Chosen for character, not quantity.',
  },
  {
    slug: 'honey-glazed-almonds',
    name: 'Honey Glazed Almonds',
    category: 'Specialty Snacks',
    price: 1450,
    variants: JSON.stringify(['250g', '500g']),
    badge: 'New',
    badgeType: 'gold',
    rating: 4.7,
    reviews: 89,
    image: '/img/product-2.jpg',
    description: 'Raw almonds coated in pure wildflower honey and slow-roasted until the glaze caramelises into a glossy, crackling shell. A treat that earns its place at any table.',
  },
  {
    slug: 'ceylon-trail-mix',
    name: 'Ceylon Trail Mix',
    category: 'Mixed Trails',
    price: 980,
    variants: JSON.stringify(['300g', '600g', '1kg']),
    badge: 'Popular',
    badgeType: 'green',
    rating: 4.6,
    reviews: 203,
    image: '/img/product-3.jpg',
    description: 'A thoughtfully assembled blend of roasted nuts, sun-dried fruits, and seeds — each element selected for its individual integrity. No fillers. No compromise. A trail mix that actually means something.',
  },
  {
    slug: 'raw-macadamia-nuts',
    name: 'Raw Macadamia Nuts',
    category: 'Raw Nuts',
    price: 2200,
    variants: JSON.stringify(['200g', '400g']),
    badge: 'Premium',
    badgeType: 'brown',
    rating: 4.9,
    reviews: 67,
    image: '/img/product-4.jpg',
    description: 'Whole and unprocessed, our macadamias arrive to you as the land intended — creamy, rich, and remarkably satisfying. Sourced from small plots where the harvest follows the season, not the deadline.',
  },
  {
    slug: 'spicy-masala-peanuts',
    name: 'Spicy Masala Peanuts',
    category: 'Specialty Snacks',
    price: 650,
    variants: JSON.stringify(['300g', '600g']),
    badge: 'Hot Pick',
    badgeType: 'red',
    rating: 4.5,
    reviews: 318,
    image: '/img/product-5.jpg',
    description: 'A recipe born from Sri Lankan kitchen tradition. Peanuts tossed in a dry masala blend and slow-roasted until the spice sets into every surface. Honest heat, no shortcuts.',
  },
  {
    slug: 'walnut-halves',
    name: 'Walnut Halves',
    category: 'Raw Nuts',
    price: 1800,
    variants: JSON.stringify(['250g', '500g', '1kg']),
    badge: null,
    badgeType: null,
    rating: 4.7,
    reviews: 95,
    image: '/img/product-6.jpg',
    description: 'Hand-selected walnut halves, dried under open air until the bitterness mellows and the natural oils concentrate into a deep, full flavour. Kept whole because the kernel is too good to break.',
  },
  {
    slug: 'toasted-coconut-chips',
    name: 'Toasted Coconut Chips',
    category: 'Specialty Snacks',
    price: 750,
    variants: JSON.stringify(['200g', '400g']),
    badge: 'Local Fav',
    badgeType: 'gold',
    rating: 4.6,
    reviews: 178,
    image: '/img/product-7.jpg',
    description: 'Thin slices of fresh coconut, dried slowly and toasted until light and crisp. A local favourite — familiar to anyone who grew up near the coast. Simple. Irreplaceable.',
  },
  {
    slug: 'pistachio-kernels',
    name: 'Pistachio Kernels',
    category: 'Raw Nuts',
    price: 2600,
    variants: JSON.stringify(['200g', '400g']),
    badge: 'Premium',
    badgeType: 'brown',
    rating: 4.8,
    reviews: 54,
    image: '/img/product-8.jpg',
    description: 'Shell-free pistachio kernels at their most vivid — green, tender, with a flavour that is both rich and delicate. Sourced selectively, packed with care, and priced honestly.',
  },
  {
    slug: 'dark-choc-almonds',
    name: 'Dark Choc Almonds',
    category: 'Specialty Snacks',
    price: 1650,
    variants: JSON.stringify(['200g', '400g']),
    badge: 'New',
    badgeType: 'gold',
    rating: 4.7,
    reviews: 72,
    image: '/img/product-9.jpg',
    description: 'Premium almonds enrobed in 72% dark chocolate — a pairing of restraint and richness. Made in small batches to ensure the chocolate sets properly around every almond.',
  },
  {
    slug: 'nut-energy-bites',
    name: 'Nut Energy Bites',
    category: 'Mixed Trails',
    price: 890,
    variants: JSON.stringify(['250g', '500g']),
    badge: null,
    badgeType: null,
    rating: 4.5,
    reviews: 131,
    image: '/img/product-10.jpg',
    description: 'Rolled from dates, mixed nuts, and seeds — no sugar added, no binders, nothing artificial. A bite that keeps its promise of energy without inflation.',
  },
  {
    slug: 'salted-pistachios',
    name: 'Salted Pistachios',
    category: 'Roasted Nuts',
    price: 2400,
    variants: JSON.stringify(['250g', '500g']),
    badge: null,
    badgeType: null,
    rating: 4.7,
    reviews: 108,
    image: '/img/product-11.jpg',
    description: 'Roasted in-shell pistachios finished with a light sea salt cure. Cracking one open is part of the ritual. Slowing down is built into the experience.',
  },
  {
    slug: 'superfood-nut-mix',
    name: 'Superfood Nut Mix',
    category: 'Mixed Trails',
    price: 1350,
    variants: JSON.stringify(['300g', '600g', '1kg']),
    badge: 'Bestseller',
    badgeType: 'green',
    rating: 4.9,
    reviews: 189,
    image: '/img/product-12.jpg',
    description: 'Walnuts, almonds, goji berries, pumpkin seeds and macadamia — each chosen for nutritional density and flavour. A mix built for people who take what they eat seriously.',
  },
]

async function main() {
  console.log('Seeding database...')

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    })
  }

  console.log('Seeded products:', products.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
