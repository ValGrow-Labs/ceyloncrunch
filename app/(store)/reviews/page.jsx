import ReviewsClient from '@/components/storefront/ReviewsClient'

export const metadata = {
  title: 'Customer Reviews — Ceylon Crunch',
  description: 'What Our Customers Say. Read genuine feedback and reviews from customers across Sri Lanka who enjoy Ceylon Crunch.',
}

const EXISTING_REVIEWS = [
  {
    name: 'Nimal Perera',
    init: 'NP',
    rating: 5,
    date: 'May 2026',
    verified: true,
    text: 'Outstanding quality. You can taste the difference — no artificial glaze, just honest roasting.',
  },
  {
    name: 'Amara Silva',
    init: 'AS',
    rating: 5,
    date: 'April 2026',
    verified: true,
    text: 'Remarkable freshness and restrained seasoning. Have ordered multiple times for my family.',
  },
  {
    name: 'Dinesh R.',
    init: 'DR',
    rating: 5,
    date: 'March 2026',
    verified: true,
    text: 'The aroma and texture are superior to mass-market brands. Truly earns its place on the table.',
  },
  {
    name: 'Kavindi Weerasinghe',
    init: 'KW',
    rating: 5,
    date: 'June 2026',
    verified: true,
    text: 'The honey glazed almonds and roasted cashews were a hit at our gathering. Beautiful packaging and very prompt delivery.',
  },
  {
    name: 'Rohan de Alwis',
    init: 'RA',
    rating: 4,
    date: 'May 2026',
    verified: true,
    text: 'Crisp crunch and great natural taste. Delivered safely to Kandy within 2 days. Will definitely be re-ordering.',
  },
]

export default function ReviewsPage() {
  return <ReviewsClient initialReviews={EXISTING_REVIEWS} />
}
