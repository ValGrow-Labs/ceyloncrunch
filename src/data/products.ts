export interface ProductVariant {
  id: string;
  weight: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export type ProductCategory =
  | 'nuts'
  | 'dried-fruits'
  | 'dates'
  | 'seeds'
  | 'berries'
  | 'exotic-nuts'
  | 'mixes'
  | 'spices'
  | 'gifts-hampers';

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  badge?: string;
  origin: string;
  roastStyle?: string;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  extendedAbout: string[];
  ingredients: string;
  storage: string;
  shelfLife: string;
  allergenNotice: string;
  variants: ProductVariant[];
  pairsWithIds: string[];
  occasions?: string[];
  isFeatured?: boolean;
}

export const CATEGORIES = [
  { slug: 'all', name: 'All Provisions', shortName: 'All' },
  { slug: 'nuts', name: 'Nuts', shortName: 'Nuts' },
  { slug: 'dried-fruits', name: 'Dried Fruits', shortName: 'Dried Fruits' },
  { slug: 'dates', name: 'Dates', shortName: 'Dates' },
  { slug: 'seeds', name: 'Seeds', shortName: 'Seeds' },
  { slug: 'berries', name: 'Berries', shortName: 'Berries' },
  { slug: 'exotic-nuts', name: 'Exotic Nuts', shortName: 'Exotic Nuts' },
  { slug: 'mixes', name: 'Mixes', shortName: 'Mixes' },
  { slug: 'spices', name: 'Whole Spices', shortName: 'Whole Spices' },
  { slug: 'gifts-hampers', name: 'Curated Hampers', shortName: 'Hampers' },
] as const;

export const CATALOG_DIRECTORY = [
  {
    columns: [
      {
        title: 'NUTS',
        categorySlug: 'nuts',
        items: [
          { name: 'Walnuts (Akhrot)', slug: 'walnuts-akhrot' },
          { name: 'Almonds (Badam)', slug: 'almonds-badam' },
          { name: 'Cashew (Kaju)', slug: 'cashew-kaju' },
          { name: 'Pistachio (Pista)', slug: 'pistachio-pista' },
        ],
      },
    ],
  },
  {
    columns: [
      {
        title: 'DRIED FRUITS',
        categorySlug: 'dried-fruits',
        items: [
          { name: 'Raisins (Kishmish)', slug: 'raisins-kishmish' },
          { name: 'Dried Figs (Anjeer)', slug: 'dried-figs-anjeer' },
          { name: 'Dried Apricots (Khubani)', slug: 'dried-apricots-khubani' },
          { name: 'Dried Kiwi', slug: 'dried-kiwi' },
          { name: 'Dried Prunes (Aaloobukhaara)', slug: 'dried-prunes-aaloobukhaara' },
        ],
      },
    ],
  },
  {
    columns: [
      {
        title: 'DATES',
        categorySlug: 'dates',
        items: [
          { name: 'Wet Dates (Khajur)', slug: 'wet-dates-khajur' },
          { name: 'Dry Dates (Chuara)', slug: 'dry-dates-chuara' },
        ],
      },
    ],
  },
  {
    columns: [
      {
        title: 'SEEDS',
        categorySlug: 'seeds',
        items: [
          { name: 'Chia Seeds', slug: 'chia-seeds' },
          { name: 'Cucumber Seeds', slug: 'cucumber-seeds' },
          { name: 'Flax Seeds', slug: 'flax-seeds' },
          { name: 'Musk Melon Seeds', slug: 'musk-melon-seeds' },
          { name: 'Pumpkin Seeds', slug: 'pumpkin-seeds' },
          { name: 'Quinoa Seeds', slug: 'quinoa-seeds' },
          { name: 'Sunflower Seeds', slug: 'sunflower-seeds' },
          { name: 'Fox Nuts (Phool Makhana)', slug: 'fox-nuts-phool-makhana' },
        ],
      },
    ],
  },
  {
    columns: [
      {
        title: 'BERRIES',
        categorySlug: 'berries',
        items: [
          { name: 'Blueberries', slug: 'blueberries' },
          { name: 'Cranberries', slug: 'cranberries' },
          { name: 'Black Currant', slug: 'black-currant' },
        ],
      },
      {
        title: 'EXOTIC NUTS',
        categorySlug: 'exotic-nuts',
        items: [
          { name: 'Hazelnuts', slug: 'hazelnuts' },
          { name: 'Macadamia Nuts', slug: 'macadamia-nuts' },
          { name: 'Pecan Nuts', slug: 'pecan-nuts' },
        ],
      },
    ],
  },
  {
    columns: [
      {
        title: 'MIXES',
        categorySlug: 'mixes',
        items: [
          { name: 'Berries Mix', slug: 'berries-mix' },
          { name: 'Nut Mix', slug: 'nut-mix' },
          { name: 'Seeds Mix', slug: 'seeds-mix' },
          { name: 'Trail Mix', slug: 'trail-mix' },
        ],
      },
      {
        title: 'WHOLE SPICES',
        categorySlug: 'spices',
        items: [
          { name: 'Whole Spices', slug: 'whole-spices' },
        ],
      },
    ],
  },
] as const;

export const OCCASIONS = [
  'All',
  'Birthdays',
  'Weddings & Nikah',
  'Corporate Gifts',
  'Festive Gifting',
] as const;

function makeVariants(prefix: string, basePrice250g: number): ProductVariant[] {
  return [
    { id: `${prefix}-100g`, weight: '100g', price: Math.round(basePrice250g * 0.45), originalPrice: Math.round(basePrice250g * 0.52), stock: 20 },
    { id: `${prefix}-250g`, weight: '250g', price: basePrice250g, originalPrice: Math.round(basePrice250g * 1.15), stock: 15 },
    { id: `${prefix}-500g`, weight: '500g', price: Math.round(basePrice250g * 1.9), originalPrice: Math.round(basePrice250g * 2.15), stock: 10 },
    { id: `${prefix}-1kg`, weight: '1kg', price: Math.round(basePrice250g * 3.65), originalPrice: Math.round(basePrice250g * 4.1), stock: 6 },
  ];
}

export const INITIAL_PRODUCTS: Product[] = [
  // ==================== 1. NUTS ====================
  {
    id: 'prod-walnuts-akhrot',
    slug: 'walnuts-akhrot',
    name: 'Walnuts (Akhrot)',
    subtitle: 'Premium Butterfly Halves · Cold-Cracked',
    category: 'nuts',
    badge: 'Raw & Pure',
    origin: 'High-Altitude Cold-Cracked Orchards',
    roastStyle: 'Sun-dried raw whole halves',
    rating: 4.9,
    reviewCount: 38,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b2/Walnuts_-_whole_and_open_with_halved_kernel.jpg/960px-Walnuts_-_whole_and_open_with_halved_kernel.jpg',
      'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Crisp, intact walnut halves (Akhrot) with mild natural sweetness and zero bitterness. Rich in plant omega-3 fatty acids and antioxidants.',
    extendedAbout: [
      'Carefully cracked by hand to preserve complete butterfly halves. Sourced from pristine high-altitude orchards and vacuum-packed for freshness.',
    ],
    ingredients: '100% Raw Walnut Kernels (Akhrot)',
    storage: 'Store in an airtight container in a cool, dry pantry or refrigerate after opening.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts (walnuts).',
    variants: makeVariants('walnuts', 1950),
    pairsWithIds: ['prod-almonds-badam', 'prod-wet-dates-khajur'],
    isFeatured: true,
  },
  {
    id: 'prod-almonds-badam',
    slug: 'almonds-badam',
    name: 'Almonds (Badam)',
    subtitle: 'King Size Whole Kernels · Sun-Ripened',
    category: 'nuts',
    badge: 'Best Seller',
    origin: 'Sun-Ripened Hand-Sorted Orchards',
    roastStyle: 'Natural whole unblanched kernels',
    rating: 4.9,
    reviewCount: 54,
    images: [
      'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg/960px-Almonds_-_in_shell%2C_shell_cracked_open%2C_shelled%2C_blanched.jpg',
    ],
    description: 'Sun-ripened whole raw almonds (Badam) with delicate golden-brown skin. Crunchy, naturally sweet, and packed with Vitamin E and plant protein.',
    extendedAbout: [
      'Selected for uniform jumbo kernel size and sweet nutty crunch. Ideal for overnight soaking, daily snacking, or artisanal baking.',
    ],
    ingredients: '100% Whole Almond Kernels (Badam)',
    storage: 'Keep sealed in a cool, dry place away from sunlight.',
    shelfLife: '8 Months',
    allergenNotice: 'Contains tree nuts (almonds).',
    variants: makeVariants('almonds', 1350),
    pairsWithIds: ['prod-cashew-kaju', 'prod-walnuts-akhrot'],
    isFeatured: true,
  },
  {
    id: 'prod-cashew-kaju',
    slug: 'cashew-kaju',
    name: 'Cashew (Kaju)',
    subtitle: 'Single-Estate W210 Jumbo · Ceylon Harvest',
    category: 'nuts',
    badge: 'Ceylon Signature',
    origin: 'Puttalam & Mannar Belt, Sri Lanka',
    roastStyle: 'Slow-cured whole ivory king kernels',
    rating: 5.0,
    reviewCount: 72,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a5/Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg/960px-Bowl_of_Cashews_and_Almonds_%2848140118636%29.jpg',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Handpicked Grade-W210 jumbo Sri Lankan cashews (Kaju). Naturally creamy, buttery, and unmatched in crunch.',
    extendedAbout: [
      'Harvested from smallholder orchards in Puttalam, Sri Lanka. Hand-graded for 100% whole ivory kernels with rich natural sweetness.',
    ],
    ingredients: '100% Pure Ceylon Whole Cashews (Kaju)',
    storage: 'Store in an airtight glass jar or resealed kraft pouch.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts (cashews).',
    variants: makeVariants('cashew', 1450),
    pairsWithIds: ['prod-almonds-badam', 'prod-pistachio-pista'],
    isFeatured: true,
  },
  {
    id: 'prod-pistachio-pista',
    slug: 'pistachio-pista',
    name: 'Pistachio (Pista)',
    subtitle: 'Roasted & Lightly Salted · Naturally Split',
    category: 'nuts',
    badge: 'Harvest Fresh',
    origin: 'Emerald Kernel Reserve',
    roastStyle: 'Pan-toasted in-shell with Hambantota sea salt',
    rating: 4.9,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?auto=format&fit=crop&w=900&q=80',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Pistachio_vera.jpg/960px-Pistachio_vera.jpg',
    ],
    description: 'Vibrant green open-shell roasted pistachios (Pista) finished with a whisper of pure sea salt crystals.',
    extendedAbout: [
      'Sorted for naturally split shells and large emerald-purple kernels with a rich, savoury-sweet roast.',
    ],
    ingredients: 'Pistachios (Pista), Pure Sea Salt',
    storage: 'Keep in an airtight container away from moisture.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts (pistachios).',
    variants: makeVariants('pistachio', 2600),
    pairsWithIds: ['prod-cashew-kaju', 'prod-almonds-badam'],
    isFeatured: true,
  },

  // ==================== 2. DRIED FRUITS ====================
  {
    id: 'prod-raisins-kishmish',
    slug: 'raisins-kishmish',
    name: 'Raisins (Kishmish)',
    subtitle: 'Sun-Dried Golden & Long Green · Seedless',
    category: 'dried-fruits',
    badge: 'Sun-Cured',
    origin: 'Sun-Drenched Vineyard Harvest',
    roastStyle: 'Naturally shade-dried seedless grapes',
    rating: 4.8,
    reviewCount: 29,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7d/Raisins_01.jpg/960px-Raisins_01.jpg',
    ],
    description: 'Plump, honey-sweet seedless golden raisins (Kishmish), naturally dried without artificial glazing or added sugar.',
    extendedAbout: [
      'Soft, juicy, and bursting with natural grape nectar. Perfect for festive Sri Lankan biryanis, cakes, oats, and healthy snacking.',
    ],
    ingredients: '100% Seedless Sun-Dried Raisins (Kishmish)',
    storage: 'Store in a cool, dry pantry.',
    shelfLife: '8 Months',
    allergenNotice: 'Naturally gluten-free. Packed in a facility that handles tree nuts.',
    variants: makeVariants('raisins', 850),
    pairsWithIds: ['prod-cashew-kaju', 'prod-dried-figs-anjeer'],
  },
  {
    id: 'prod-dried-figs-anjeer',
    slug: 'dried-figs-anjeer',
    name: 'Dried Figs (Anjeer)',
    subtitle: 'Whole Sun-Cured Rings · High Fibre',
    category: 'dried-fruits',
    badge: 'Best Seller',
    origin: 'Traditional Sun-Dried Orchards',
    roastStyle: 'Sun-cured whole tender figs',
    rating: 4.9,
    reviewCount: 34,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Dried_figs_%282%29.jpg/960px-Dried_figs_%282%29.jpg',
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Soft, honey-rich sun-dried figs (Anjeer) with crunchy seed centres. Naturally rich in calcium, iron, and dietary fibre.',
    extendedAbout: [
      'Cured under warm orchard sun without chemical bleaching. Delicious on their own, soaked overnight, or paired with walnuts and almonds.',
    ],
    ingredients: '100% Whole Sun-Dried Figs (Anjeer)',
    storage: 'Store in an airtight container; refrigerate in warm climates.',
    shelfLife: '8 Months',
    allergenNotice: 'Naturally gluten-free.',
    variants: makeVariants('figs', 1850),
    pairsWithIds: ['prod-walnuts-akhrot', 'prod-almonds-badam'],
  },
  {
    id: 'prod-dried-apricots-khubani',
    slug: 'dried-apricots-khubani',
    name: 'Dried Apricots (Khubani)',
    subtitle: 'Pitted Golden Halves · Tangy-Sweet',
    category: 'dried-fruits',
    badge: 'Orchard Pick',
    origin: 'Mountain Orchard Reserve',
    roastStyle: 'Sun-ripened whole pitted apricots',
    rating: 4.8,
    reviewCount: 24,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Ab_food_04.jpg/960px-Ab_food_04.jpg',
    ],
    description: 'Velvety, sun-dried golden apricots (Khubani) with a vibrant balance of floral sweetness and gentle orchard tang.',
    extendedAbout: [
      'Rich in beta-carotene, potassium, and dietary fibre. Hand-pitted and gently dried to preserve their soft, chewy bite.',
    ],
    ingredients: '100% Sun-Dried Pitted Apricots (Khubani)',
    storage: 'Store sealed in a cool, dry place.',
    shelfLife: '8 Months',
    allergenNotice: 'Naturally gluten-free.',
    variants: makeVariants('apricots', 1650),
    pairsWithIds: ['prod-dried-figs-anjeer', 'prod-dried-kiwi'],
  },
  {
    id: 'prod-dried-kiwi',
    slug: 'dried-kiwi',
    name: 'Dried Kiwi',
    subtitle: 'Emerald Green Slices · Tangy Tropical',
    category: 'dried-fruits',
    badge: 'Vitamin C Rich',
    origin: 'Artisan Dehydrated Fruit Selection',
    roastStyle: 'Gently dehydrated emerald kiwi rings',
    rating: 4.7,
    reviewCount: 19,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/68/Dried_kiwi_fruit_slices.jpg/960px-Dried_kiwi_fruit_slices.jpg',
    ],
    description: 'Vibrant emerald slices of dehydrated kiwi fruit with tiny crunchy black seeds and a refreshing sweet-tart zing.',
    extendedAbout: [
      'Carefully sliced and slow-dried at low temperatures to preserve the jewel-green colour and bright tropical aroma.',
    ],
    ingredients: 'Kiwi Fruit, Natural Cane Sugar',
    storage: 'Keep sealed in a cool, dry pantry.',
    shelfLife: '6 Months',
    allergenNotice: 'Gluten-free.',
    variants: makeVariants('kiwi', 1450),
    pairsWithIds: ['prod-dried-apricots-khubani', 'prod-dried-prunes-aaloobukhaara'],
  },
  {
    id: 'prod-dried-prunes-aaloobukhaara',
    slug: 'dried-prunes-aaloobukhaara',
    name: 'Dried Prunes (Aaloobukhaara)',
    subtitle: 'Succulent Pitted Plums · Gut Health',
    category: 'dried-fruits',
    badge: 'Wellness Pick',
    origin: 'Heirloom Plum Orchards',
    roastStyle: 'Tree-ripened sun-cured plums',
    rating: 4.8,
    reviewCount: 21,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/97/Rosales_-_Dried_Prunus_domestica_d.jpg/960px-Rosales_-_Dried_Prunus_domestica_d.jpg',
    ],
    description: 'Deep ruby-black pitted dried prunes (Aaloobukhaara) with rich plum sweetness and a soft, melt-in-the-mouth texture.',
    extendedAbout: [
      'Renowned for digestive wellness and antioxidant richness. Enjoy straight from the pouch or stewed with warm Ceylon cinnamon.',
    ],
    ingredients: '100% Pitted Dried Prunes (Aaloobukhaara)',
    storage: 'Refrigerate after opening for best texture.',
    shelfLife: '8 Months',
    allergenNotice: 'Naturally gluten-free.',
    variants: makeVariants('prunes', 1550),
    pairsWithIds: ['prod-dried-figs-anjeer', 'prod-raisins-kishmish'],
  },

  // ==================== 3. DATES ====================
  {
    id: 'prod-wet-dates-khajur',
    slug: 'wet-dates-khajur',
    name: 'Wet Dates (Khajur)',
    subtitle: 'Royal Medjool & Kimia · Soft & Caramelly',
    category: 'dates',
    badge: 'Oasis Reserve',
    origin: 'Heritage Date Palm Oasis',
    roastStyle: 'Tree-ripened soft honey dates',
    rating: 4.9,
    reviewCount: 46,
    images: [
      'https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&w=900&q=80',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/45/Dates005.jpg/960px-Dates005.jpg',
    ],
    description: 'Succulent, glossy wet dates (Khajur) with tender mahogany flesh and rich notes of wild honey and toffee.',
    extendedAbout: [
      'Harvested fresh from the palm without glucose syrups or artificial preservatives. An instant natural energy booster.',
    ],
    ingredients: '100% Whole Soft Wet Dates (Khajur)',
    storage: 'Store in a cool pantry or refrigerate to preserve softness.',
    shelfLife: '9 Months',
    allergenNotice: 'Contains natural date pits.',
    variants: makeVariants('wet-dates', 1350),
    pairsWithIds: ['prod-dry-dates-chuara', 'prod-almonds-badam'],
    isFeatured: true,
  },
  {
    id: 'prod-dry-dates-chuara',
    slug: 'dry-dates-chuara',
    name: 'Dry Dates (Chuara)',
    subtitle: 'Sun-Dehydrated Whole Dates · Traditional Vitality',
    category: 'dates',
    badge: 'Traditional',
    origin: 'Sun-Cured Desert Harvest',
    roastStyle: 'Naturally sun-hardened caramel dates',
    rating: 4.8,
    reviewCount: 25,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1d/Dry_Dates_%28Debino%29.jpg/960px-Dry_Dates_%28Debino%29.jpg',
    ],
    description: 'Nutrient-dense sun-dried dates (Chuara) with a firm, chewy bite and concentrated mineral sweetness.',
    extendedAbout: [
      'Traditionally prized for iron, calcium, and stamina. Ideal for simmering in warm spiced milk, homemade energy powders, or long-lasting pantry storage.',
    ],
    ingredients: '100% Sun-Dried Whole Dates (Chuara)',
    storage: 'Store in an airtight jar in a dry cupboard.',
    shelfLife: '12 Months',
    allergenNotice: 'Contains natural date pits.',
    variants: makeVariants('dry-dates', 1100),
    pairsWithIds: ['prod-wet-dates-khajur', 'prod-walnuts-akhrot'],
  },

  // ==================== 4. SEEDS ====================
  {
    id: 'prod-chia-seeds',
    slug: 'chia-seeds',
    name: 'Chia Seeds',
    subtitle: 'Raw Black Superfood Seeds · Omega-3 & Fibre',
    category: 'seeds',
    badge: 'Superfood',
    origin: 'Cleaned Grade-A Botanical Harvest',
    roastStyle: '100% raw unroasted seeds',
    rating: 4.9,
    reviewCount: 37,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Seed_of_chia_%28Salvia_hispanica%29Salvia_hispanica_group.jpg/960px-Seed_of_chia_%28Salvia_hispanica%29Salvia_hispanica_group.jpg',
    ],
    description: 'Pure black and mottled chia seeds rich in plant-based Omega-3s, complete protein, and soluble fibre.',
    extendedAbout: [
      'Swells into a silky gel when soaked in coconut milk, water, or yoghurt. Perfect for chia puddings, smoothies, and overnight oats.',
    ],
    ingredients: '100% Raw Chia Seeds (Salvia hispanica)',
    storage: 'Keep sealed in a cool, dry cupboard.',
    shelfLife: '12 Months',
    allergenNotice: 'Naturally gluten-free.',
    variants: makeVariants('chia', 950),
    pairsWithIds: ['prod-flax-seeds', 'prod-pumpkin-seeds'],
  },
  {
    id: 'prod-cucumber-seeds',
    slug: 'cucumber-seeds',
    name: 'Cucumber Seeds',
    subtitle: 'Hulled Magaz Kernels · Cooling & Nutrient Rich',
    category: 'seeds',
    badge: 'Pure Kernels',
    origin: 'Artisan Hulled Seed Selection',
    roastStyle: 'Raw hulled ivory seed kernels',
    rating: 4.7,
    reviewCount: 16,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e1/Cucumber_seeds.jpg/960px-Cucumber_seeds.jpg',
    ],
    description: 'Delicate, creamy ivory cucumber seed kernels packed with cooling minerals, plant protein, and healthy fats.',
    extendedAbout: [
      'A classic addition to traditional thandai, sweets, smoothie bowls, and bakery toppings.',
    ],
    ingredients: '100% Hulled Cucumber Seed Kernels',
    storage: 'Store in an airtight container.',
    shelfLife: '9 Months',
    allergenNotice: 'Packed in a facility that handles nuts and seeds.',
    variants: makeVariants('cucumber-seeds', 1150),
    pairsWithIds: ['prod-musk-melon-seeds', 'prod-pumpkin-seeds'],
  },
  {
    id: 'prod-flax-seeds',
    slug: 'flax-seeds',
    name: 'Flax Seeds',
    subtitle: 'Golden-Brown Alsi · Lightly Crisp & Nutty',
    category: 'seeds',
    badge: 'Heart Healthy',
    origin: 'Single-Origin Botanical Harvest',
    roastStyle: 'Cleaned raw whole flax seeds',
    rating: 4.8,
    reviewCount: 28,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Linum_usitatissimum_qtl1.jpg/960px-Linum_usitatissimum_qtl1.jpg',
    ],
    description: 'Glossy golden-brown flax seeds (Alsi) loaded with lignans, dietary fibre, and essential alpha-linolenic acid (ALA).',
    extendedAbout: [
      'Enjoy lightly dry-toasted for a nutty crunch over salads and curries, or freshly ground into morning smoothies and rotis.',
    ],
    ingredients: '100% Whole Flax Seeds (Linum usitatissimum)',
    storage: 'Store in a cool, dark pantry.',
    shelfLife: '12 Months',
    allergenNotice: 'Naturally gluten-free.',
    variants: makeVariants('flax', 650),
    pairsWithIds: ['prod-chia-seeds', 'prod-sunflower-seeds'],
  },
  {
    id: 'prod-musk-melon-seeds',
    slug: 'musk-melon-seeds',
    name: 'Musk Melon Seeds',
    subtitle: 'Sweet Cantaloupe Kernels · Protein Packed',
    category: 'seeds',
    badge: 'Culinary Grade',
    origin: 'Sun-Cured Hulled Seed Reserve',
    roastStyle: 'Raw hulled sweet melon kernels',
    rating: 4.8,
    reviewCount: 20,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/37/EGUSI_UNSHELLED.JPG/960px-EGUSI_UNSHELLED.JPG',
    ],
    description: 'Plump, sweet musk melon seed kernels rich in magnesium, zinc, and plant-based protein.',
    extendedAbout: [
      'Delicious lightly toasted with a pinch of sea salt, blended into rich gravies, or sprinkled on artisan breads.',
    ],
    ingredients: '100% Hulled Musk Melon Seeds',
    storage: 'Keep in an airtight container.',
    shelfLife: '9 Months',
    allergenNotice: 'Seed product.',
    variants: makeVariants('musk-melon', 1200),
    pairsWithIds: ['prod-cucumber-seeds', 'prod-pumpkin-seeds'],
  },
  {
    id: 'prod-pumpkin-seeds',
    slug: 'pumpkin-seeds',
    name: 'Pumpkin Seeds',
    subtitle: 'AA-Grade Emerald Pepitas · Zinc & Magnesium',
    category: 'seeds',
    badge: 'Best Seller',
    origin: 'Selected Non-GMO Harvest',
    roastStyle: 'Raw hulled green pumpkin kernels',
    rating: 4.9,
    reviewCount: 44,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2e/Pepita_de_calabaza.jpg/960px-Pepita_de_calabaza.jpg',
      'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Dark emerald AA-grade pumpkin seeds (Pepitas) with a crisp, nutty bite. Naturally rich in zinc, magnesium, and tryptophan.',
    extendedAbout: [
      'Clean, hull-free green kernels ideal for daily immunity support, salad crunch, or homemade granola bars.',
    ],
    ingredients: '100% Raw Hulled Pumpkin Seeds',
    storage: 'Keep sealed in a cool, dry place.',
    shelfLife: '9 Months',
    allergenNotice: 'Naturally gluten-free.',
    variants: makeVariants('pumpkin', 1250),
    pairsWithIds: ['prod-sunflower-seeds', 'prod-chia-seeds'],
  },
  {
    id: 'prod-quinoa-seeds',
    slug: 'quinoa-seeds',
    name: 'Quinoa Seeds',
    subtitle: 'Pre-Washed White & Red Grain · Complete Protein',
    category: 'seeds',
    badge: 'Complete Protein',
    origin: 'High-Altitude Ancient Grain Harvest',
    roastStyle: 'Saponin-free triple-washed whole grain',
    rating: 4.8,
    reviewCount: 23,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d0/Chenopodium_quinoa_-red_faro-_MHNT.BOT.2007.43.66.jpg/960px-Chenopodium_quinoa_-red_faro-_MHNT.BOT.2007.43.66.jpg',
    ],
    description: 'Fluffy, nutty quinoa seeds containing all nine essential amino acids. A wholesome, low-GI alternative to rice.',
    extendedAbout: [
      'Pre-washed to remove natural bitterness and cooks in just 15 minutes into light, nutrient-rich grains.',
    ],
    ingredients: '100% Whole Quinoa Seeds',
    storage: 'Store in a dry pantry container.',
    shelfLife: '12 Months',
    allergenNotice: '100% gluten-free.',
    variants: makeVariants('quinoa', 1100),
    pairsWithIds: ['prod-chia-seeds', 'prod-flax-seeds'],
  },
  {
    id: 'prod-sunflower-seeds',
    slug: 'sunflower-seeds',
    name: 'Sunflower Seeds',
    subtitle: 'Hulled Bakery Grade Kernels · Vitamin E Rich',
    category: 'seeds',
    badge: 'Raw & Pure',
    origin: 'Sun-Ripened Golden Fields',
    roastStyle: 'Raw hulled sunflower kernels',
    rating: 4.8,
    reviewCount: 27,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Sunflower_Seeds_Kaldari.jpg/960px-Sunflower_Seeds_Kaldari.jpg',
    ],
    description: 'Sweet, mild, and crunchy hulled sunflower seed kernels packed with Vitamin E, selenium, and healthy plant fats.',
    extendedAbout: [
      'Ready to eat straight from the pouch or lightly toasted over breakfast bowls, soups, and multigrain loaves.',
    ],
    ingredients: '100% Hulled Sunflower Seed Kernels',
    storage: 'Store in a cool, dry place.',
    shelfLife: '9 Months',
    allergenNotice: 'Gluten-free.',
    variants: makeVariants('sunflower', 750),
    pairsWithIds: ['prod-pumpkin-seeds', 'prod-flax-seeds'],
  },
  {
    id: 'prod-fox-nuts-phool-makhana',
    slug: 'fox-nuts-phool-makhana',
    name: 'Fox Nuts (Phool Makhana)',
    subtitle: 'Jumbo Popped Lotus Seeds · Light & Crunchy',
    category: 'seeds',
    badge: 'Low Calorie',
    origin: 'Traditional Pond-Harvested Lotus Seeds',
    roastStyle: 'Hand-popped jumbo white pearls',
    rating: 4.9,
    reviewCount: 33,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0e/Foxnut_Makhana_-_Nawada_District_-_Bihar_-_1.jpg/960px-Foxnut_Makhana_-_Nawada_District_-_Bihar_-_1.jpg',
    ],
    description: 'Airy, snow-white popped lotus seeds (Phool Makhana). High in calcium and protein with virtually zero fat.',
    extendedAbout: [
      'Roast in a spoonful of ghee or coconut oil with Ceylon black pepper and sea salt for the ultimate guilt-free evening crunch.',
    ],
    ingredients: '100% Popped Lotus Seeds (Phool Makhana)',
    storage: 'Keep in a tightly sealed container to maintain crispness.',
    shelfLife: '6 Months',
    allergenNotice: 'Naturally gluten-free and nut-free.',
    variants: makeVariants('makhana', 1350),
    pairsWithIds: ['prod-cashew-kaju', 'prod-almonds-badam'],
  },

  // ==================== 5. BERRIES ====================
  {
    id: 'prod-blueberries',
    slug: 'blueberries',
    name: 'Blueberries',
    subtitle: 'Whole Sun-Dried Wild Berries · Antioxidant Superfruit',
    category: 'berries',
    badge: 'Antioxidant Rich',
    origin: 'Wild Mountain Berry Reserve',
    roastStyle: 'Gently dehydrated whole blueberries',
    rating: 4.9,
    reviewCount: 31,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Blueberries.jpg',
    ],
    description: 'Plump, aromatic dried blueberries bursting with deep berry sweetness and anthocyanin antioxidants.',
    extendedAbout: [
      'Gently dried to lock in natural berry juices. Delicious in pancakes, muesli, yoghurt parfaits, or straight from the jar.',
    ],
    ingredients: 'Whole Blueberries, Natural Fruit Juice Concentrate',
    storage: 'Store sealed in a cool, dark pantry.',
    shelfLife: '8 Months',
    allergenNotice: 'Gluten-free.',
    variants: makeVariants('blueberries', 2250),
    pairsWithIds: ['prod-cranberries', 'prod-black-currant'],
  },
  {
    id: 'prod-cranberries',
    slug: 'cranberries',
    name: 'Cranberries',
    subtitle: 'Ruby Red Whole Sliced · Sweet & Tangy',
    category: 'berries',
    badge: 'Best Seller',
    origin: 'Harvest Berry Orchards',
    roastStyle: 'Sun-cured ruby cranberries',
    rating: 4.8,
    reviewCount: 35,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/04/Dried-Cranberries.png/960px-Dried-Cranberries.png',
      'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Vibrant ruby-red dried cranberries with a bright, refreshing sweet-tart flavour profile.',
    extendedAbout: [
      'Rich in proanthocyanidins and Vitamin C. A favourite addition to trail mixes, salads, and festive bakes.',
    ],
    ingredients: 'Dried Cranberries, Apple Juice Concentrate, Sunflower Oil (<1%)',
    storage: 'Keep resealed in a cool pantry.',
    shelfLife: '9 Months',
    allergenNotice: 'Gluten-free.',
    variants: makeVariants('cranberries', 1550),
    pairsWithIds: ['prod-blueberries', 'prod-almonds-badam'],
  },
  {
    id: 'prod-black-currant',
    slug: 'black-currant',
    name: 'Black Currant',
    subtitle: 'Tiny Seedless Tangy Jewels · Iron & Vitamin C',
    category: 'berries',
    badge: 'Tangy & Sweet',
    origin: 'Cool-Climate Vineyard Harvest',
    roastStyle: 'Shade-dried whole seedless currants',
    rating: 4.8,
    reviewCount: 19,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Ribes_nigrum_a1.JPG/960px-Ribes_nigrum_a1.JPG',
    ],
    description: 'Intensely flavourful, tangy-sweet dried black currants packed with iron, potassium, and antioxidants.',
    extendedAbout: [
      'Adds a burst of deep berry tang to artisan breads, ice creams, oat bowls, and festive fruit cakes.',
    ],
    ingredients: '100% Sun-Dried Seedless Black Currants',
    storage: 'Store in a cool, dry cupboard.',
    shelfLife: '8 Months',
    allergenNotice: 'Naturally gluten-free.',
    variants: makeVariants('black-currant', 1400),
    pairsWithIds: ['prod-blueberries', 'prod-cranberries'],
  },

  // ==================== 6. EXOTIC NUTS ====================
  {
    id: 'prod-hazelnuts',
    slug: 'hazelnuts',
    name: 'Hazelnuts',
    subtitle: 'Blanched & Dry-Roasted Filberts · Buttery Crunch',
    category: 'exotic-nuts',
    badge: 'Exotic Reserve',
    origin: 'Black Sea Orchard Kernels',
    roastStyle: 'Dry-roasted skinless golden kernels',
    rating: 4.9,
    reviewCount: 22,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Hazelnuts_%28Corylus_avellana%29_-_whole_with_kernels.jpg/960px-Hazelnuts_%28Corylus_avellana%29_-_whole_with_kernels.jpg',
    ],
    description: 'Crunchy, aromatic hazelnut kernels with a rich toasted praline flavour and creamy finish.',
    extendedAbout: [
      'Slow-warmed to release their signature nutty perfume. Perfect alongside dark Ceylon chocolate or espresso.',
    ],
    ingredients: '100% Whole Hazelnut Kernels',
    storage: 'Keep sealed in an airtight jar.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts (hazelnuts).',
    variants: makeVariants('hazelnuts', 2500),
    pairsWithIds: ['prod-macadamia-nuts', 'prod-pecan-nuts'],
  },
  {
    id: 'prod-macadamia-nuts',
    slug: 'macadamia-nuts',
    name: 'Macadamia Nuts',
    subtitle: 'Ivory Cream Whole Kernels · Melt-in-Mouth',
    category: 'exotic-nuts',
    badge: 'Luxury Grade',
    origin: 'Subtropical Orchard Reserve',
    roastStyle: 'Lightly dry-toasted creamy wholes',
    rating: 5.0,
    reviewCount: 26,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Macadamia_nuts.jpg/960px-Macadamia_nuts.jpg',
    ],
    description: 'The world’s most buttery, velvety nut. Whole ivory macadamia kernels with a delicate crunch and rich creamy finish.',
    extendedAbout: [
      'High in heart-healthy monounsaturated fats and keto-friendly nutrition. Hand-selected for whole style-0/style-1 kernels.',
    ],
    ingredients: '100% Whole Macadamia Nut Kernels',
    storage: 'Store in a cool, dry place or refrigerate.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts (macadamia).',
    variants: makeVariants('macadamia', 3400),
    pairsWithIds: ['prod-pecan-nuts', 'prod-hazelnuts'],
  },
  {
    id: 'prod-pecan-nuts',
    slug: 'pecan-nuts',
    name: 'Pecan Nuts',
    subtitle: 'Mammoth Golden Halves · Naturally Buttery & Sweet',
    category: 'exotic-nuts',
    badge: 'Exotic Reserve',
    origin: 'River-Valley Pecan Groves',
    roastStyle: 'Raw mammoth halves',
    rating: 4.9,
    reviewCount: 18,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/49/Pecans.jpg/960px-Pecans.jpg',
    ],
    description: 'Rich, maple-sweet mammoth pecan halves with a tender, buttery crunch and golden-brown grooves.',
    extendedAbout: [
      'Packed with more than 19 vitamins and minerals. Wonderful for snacking, caramelizing, or topping salads and pies.',
    ],
    ingredients: '100% Mammoth Pecan Halves',
    storage: 'Refrigerate in an airtight jar for extended freshness.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts (pecans).',
    variants: makeVariants('pecans', 3100),
    pairsWithIds: ['prod-macadamia-nuts', 'prod-walnuts-akhrot'],
  },

  // ==================== 7. MIXES ====================
  {
    id: 'prod-berries-mix',
    slug: 'berries-mix',
    name: 'Berries Mix',
    subtitle: 'Blueberries, Cranberries, Black Currants & Cherries',
    category: 'mixes',
    badge: 'Antioxidant Blend',
    origin: 'Ceylon Crunch Artisan Blend',
    roastStyle: 'Sun-cured four-berry medley',
    rating: 4.9,
    reviewCount: 30,
    images: [
      'https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'A vibrant jewel-toned medley of dried blueberries, ruby cranberries, tangy black currants, and sweet red berries.',
    extendedAbout: [
      'Hand-blended in small batches for balanced sweetness and tartness in every spoonful.',
    ],
    ingredients: 'Dried Blueberries, Dried Cranberries, Black Currants, Golden Raisins',
    storage: 'Keep sealed in a cool pantry.',
    shelfLife: '8 Months',
    allergenNotice: 'Gluten-free.',
    variants: makeVariants('berries-mix', 1850),
    pairsWithIds: ['prod-nut-mix', 'prod-trail-mix'],
  },
  {
    id: 'prod-nut-mix',
    slug: 'nut-mix',
    name: 'Nut Mix',
    subtitle: 'Royal 5-Nut Symphony · Cashews, Almonds, Walnuts, Pista & Hazelnuts',
    category: 'mixes',
    badge: 'Best Seller',
    origin: 'Colombo Small-Batch Roastery',
    roastStyle: 'Lightly toasted & raw gourmet nut blend',
    rating: 5.0,
    reviewCount: 52,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f5/Mixed_nuts_small_white1.jpg/960px-Mixed_nuts_small_white1.jpg',
      'https://images.unsplash.com/photo-1536591375315-1b83681498b3?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Our signature luxury nut blend combining jumbo Ceylon cashews, whole almonds, walnut halves, pistachio kernels, and roasted hazelnuts.',
    extendedAbout: [
      'Zero peanuts or cheap fillers — strictly 100% premium tree nuts in balanced proportions.',
    ],
    ingredients: 'Cashews (Kaju), Almonds (Badam), Walnuts (Akhrot), Pistachios (Pista), Hazelnuts',
    storage: 'Store in an airtight glass jar.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts.',
    variants: makeVariants('nut-mix', 1950),
    pairsWithIds: ['prod-trail-mix', 'prod-seeds-mix'],
    isFeatured: true,
  },
  {
    id: 'prod-seeds-mix',
    slug: 'seeds-mix',
    name: 'Seeds Mix',
    subtitle: '5-in-1 Superseed Crunch · Pumpkin, Sunflower, Flax, Chia & Melon',
    category: 'mixes',
    badge: 'Daily Superfood',
    origin: 'Artisan Botanical Studio',
    roastStyle: 'Raw & lightly toasted multi-seed blend',
    rating: 4.8,
    reviewCount: 28,
    images: [
      'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Powerhouse daily nutrition blending emerald pumpkin seeds, sunflower kernels, flax seeds, black chia, and musk melon seeds.',
    extendedAbout: [
      'Sprinkle two tablespoons over your morning curd, porridge, salad, or smoothie for sustained plant protein and minerals.',
    ],
    ingredients: 'Pumpkin Seeds, Sunflower Seeds, Flax Seeds, Chia Seeds, Musk Melon Seeds',
    storage: 'Store in a cool, dry cupboard.',
    shelfLife: '9 Months',
    allergenNotice: 'Seed blend.',
    variants: makeVariants('seeds-mix', 1150),
    pairsWithIds: ['prod-nut-mix', 'prod-berries-mix'],
  },
  {
    id: 'prod-trail-mix',
    slug: 'trail-mix',
    name: 'Trail Mix',
    subtitle: 'Active Energy Blend · Nuts, Seeds, Berries & Dates',
    category: 'mixes',
    badge: 'Energy Boost',
    origin: 'Colombo Small-Batch Roastery',
    roastStyle: 'Balanced sweet & savoury adventure mix',
    rating: 4.9,
    reviewCount: 40,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fd/2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/960px-2021-05-15_04_45_03_A_sample_of_Kirkland_Trail_Mix_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg',
    ],
    description: 'The ultimate on-the-go fuel combining roasted cashews, almonds, pumpkin seeds, ruby cranberries, golden raisins, and diced dates.',
    extendedAbout: [
      'Crafted for hikers, gym-goers, and busy professionals seeking clean, sustained energy without refined sugar crashes.',
    ],
    ingredients: 'Roasted Cashews, Almonds, Walnuts, Pumpkin Seeds, Sunflower Seeds, Cranberries, Golden Raisins',
    storage: 'Keep resealed in a cool, dry place.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts and seeds.',
    variants: makeVariants('trail-mix', 1650),
    pairsWithIds: ['prod-nut-mix', 'prod-berries-mix'],
  },

  // ==================== 8. WHOLE SPICES ====================
  {
    id: 'prod-whole-spices',
    slug: 'whole-spices',
    name: 'Whole Spices (Ceylon Alba Cinnamon & Pepper)',
    subtitle: 'Single-Estate Ceylon Alba Quills, Black Pepper & Green Cardamom',
    category: 'spices',
    badge: 'Ceylon Pure',
    origin: 'Mirissa & Matale Spice Estates, Sri Lanka',
    roastStyle: 'Sun-cured whole estate spices',
    rating: 5.0,
    reviewCount: 32,
    images: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Cinnamomum_verum_spices.jpg/960px-Cinnamomum_verum_spices.jpg',
      'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'Authentic Sri Lankan whole spices featuring hand-rolled Alba cinnamon quills, Matale black peppercorns, green cardamom pods, and whole cloves.',
    extendedAbout: [
      'Harvested from heritage spice gardens in central and southern Sri Lanka with high essential oil content and intoxicating aroma.',
    ],
    ingredients: 'True Ceylon Alba Cinnamon Quills, Whole Black Peppercorns, Green Cardamom, Whole Cloves',
    storage: 'Store in airtight glass jars away from light and moisture.',
    shelfLife: '18 Months',
    allergenNotice: 'Pure whole spices.',
    variants: makeVariants('whole-spices', 1750),
    pairsWithIds: ['prod-cashew-kaju', 'prod-heritage-hamper'],
  },

  // ==================== 9. GIFTS & HAMPERS ====================
  {
    id: 'prod-heritage-hamper',
    slug: 'heritage-harvest-hamper',
    name: 'The Heritage Harvest Hamper',
    subtitle: 'Curated Luxury · Solid Pine Box',
    category: 'gifts-hampers',
    badge: 'Gift Ready',
    origin: 'Handcrafted in Colombo with Sri Lankan Provisions',
    roastStyle: 'Assorted cashews, almonds, dates, figs & Ceylon spices',
    rating: 5.0,
    reviewCount: 39,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    ],
    description: 'An exquisite hand-built pine chest packed with Cashew (Kaju), Almonds (Badam), Wet Dates (Khajur), Dried Figs (Anjeer), and Whole Ceylon Spices.',
    extendedAbout: [
      'Tied with deep forest green grosgrain ribbon and accompanied by a custom greeting card for weddings, birthdays, and corporate gifting.',
    ],
    ingredients: 'Cashews (250g), Almonds (250g), Wet Dates (300g), Dried Figs (250g), Whole Spices (150g)',
    storage: 'Store items in cool pantry conditions.',
    shelfLife: '6 Months',
    allergenNotice: 'Contains tree nuts.',
    variants: [
      { id: 'hamper-box', weight: 'Standard Gift Box', price: 6500, originalPrice: 7200, stock: 10 },
      { id: 'hamper-chest', weight: 'Royal Pine Chest', price: 12500, originalPrice: 13900, stock: 4 },
    ],
    occasions: ['Birthdays', 'Weddings & Nikah', 'Corporate Gifts', 'Festive Gifting'],
    pairsWithIds: ['prod-nut-mix', 'prod-whole-spices'],
    isFeatured: true,
  },
];

export const INITIAL_REVIEWS: Record<string, Review[]> = {
  'prod-cashew-kaju': [
    {
      id: 'rev-1',
      author: 'Naveen Samaraweera',
      location: 'Colombo 07',
      rating: 5,
      date: '14 Oct 2024',
      comment: 'Hands down the crispiest jumbo cashews in Sri Lanka. Super fresh and buttery.',
      verified: true,
    },
  ],
};

// Helper: Calculate lowest in-stock variant price ("From Rs. X")
export function getLowestPrice(product: Product): { price: number; inStock: boolean } {
  const inStockVariants = product.variants.filter((v) => v.stock > 0);
  if (inStockVariants.length > 0) {
    const minPrice = Math.min(...inStockVariants.map((v) => v.price));
    return { price: minPrice, inStock: true };
  }
  const nominalMin = Math.min(...product.variants.map((v) => v.price));
  return { price: nominalMin, inStock: false };
}

// Format Sri Lankan Rupee
export function formatRs(amount: number): string {
  return 'Rs. ' + amount.toLocaleString('en-US');
}
