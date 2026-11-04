export interface SocialLink {
  id: string;
  name: string;
  url: string;
  handle: string;
  icon: 'instagram' | 'facebook' | 'tiktok' | 'whatsapp' | 'email' | 'phone';
  color: string;
}

export interface BioLinkItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  isExternal?: boolean;
  icon: string;
  badge?: string;
  highlight?: boolean;
  category: 'primary' | 'shop' | 'contact' | 'social' | 'brand';
}

export interface LinkBioConfig {
  brand: {
    name: string;
    tagline: string;
    description: string;
    logoUrl: string;
    verified: boolean;
    location: string;
  };
  socialLinks: SocialLink[];
  buttons: BioLinkItem[];
}

/**
 * Link-in-Bio Central Configuration
 * Update any URLs, labels, or social media handles here.
 */
export const linkBioConfig: LinkBioConfig = {
  brand: {
    name: 'Ceylon Crunch',
    tagline: 'From Nature To Your Doorstep',
    description: 'Freshly roasted Ceylon nuts, exotic dates, gourmet dried fruits & handcrafted festive hampers delivered across Sri Lanka.',
    logoUrl: '/logo.png',
    verified: true,
    location: 'Colombo, Sri Lanka',
  },
  socialLinks: [
    {
      id: 'instagram',
      name: 'Instagram',
      url: 'https://www.instagram.com/ceyloncrunch_lk?rpxt=MTFtbnNwcTU3ZTZnNQ%3D%3D&utm_source=qr',
      handle: '@ceyloncrunch_lk',
      icon: 'instagram',
      color: '#E1306C',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      url: 'https://www.facebook.com/share/1ENWdAdxez/',
      handle: 'Ceylon Crunch',
      icon: 'facebook',
      color: '#1877F2',
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      url: 'https://www.tiktok.com/@ceyloncrunchlk?_r=1&_t=ZS-9APNpLNJ9l8',
      handle: '@ceyloncrunchlk',
      icon: 'tiktok',
      color: '#000000',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Concierge',
      url: 'https://wa.me/94779443867?text=Hello%20Ceylon%20Crunch,%20I%20would%20like%20to%20place%20an%20order',
      handle: '+94 77 944 3867',
      icon: 'whatsapp',
      color: '#25D366',
    },
  ],
  buttons: [
    {
      id: 'official-website',
      title: 'Official Website & Online Store',
      subtitle: 'Browse whole catalogue with instant island-wide delivery',
      url: '/',
      isExternal: false,
      icon: 'Globe',
      badge: 'Official',
      highlight: true,
      category: 'primary',
    },
    {
      id: 'all-products',
      title: 'Shop All Products & Superfoods',
      subtitle: 'Fresh roasted nuts, organic seeds & dried fruits',
      url: '/shop',
      isExternal: false,
      icon: 'ShoppingBag',
      badge: 'Best Sellers',
      category: 'shop',
    },
    {
      id: 'gifting-hampers',
      title: 'Luxury Gift Boxes & Festive Hampers',
      subtitle: 'Artisanal packaging curated for celebrations & loved ones',
      url: '/gifting',
      isExternal: false,
      icon: 'Gift',
      badge: 'Gifting',
      category: 'shop',
    },
    {
      id: 'corporate-orders',
      title: 'Corporate & Bulk Inquiries',
      subtitle: 'Customized luxury corporate gifting & custom packaging',
      url: '/corporate',
      isExternal: false,
      icon: 'Briefcase',
      category: 'brand',
    },
    {
      id: 'whatsapp-order',
      title: 'Order Direct via WhatsApp',
      subtitle: 'Fast chat support with our concierge team',
      url: 'https://wa.me/94779443867?text=Hello%20Ceylon%20Crunch,%20I%20would%20like%20to%20place%20an%20order',
      isExternal: true,
      icon: 'MessageCircle',
      badge: 'Instant Response',
      category: 'contact',
    },
    {
      id: 'track-order',
      title: 'Track Your Live Order',
      subtitle: 'Check real-time dispatch & courier status',
      url: '/track',
      isExternal: false,
      icon: 'Truck',
      category: 'primary',
    },
    {
      id: 'instagram-profile',
      title: 'Follow Us on Instagram',
      subtitle: 'Daily recipes, behind-the-scenes & harvest updates',
      url: 'https://www.instagram.com/ceyloncrunch_lk?rpxt=MTFtbnNwcTU3ZTZnNQ%3D%3D&utm_source=qr',
      isExternal: true,
      icon: 'Instagram',
      category: 'social',
    },
    {
      id: 'tiktok-feed',
      title: 'Watch Us on TikTok',
      subtitle: 'Crunch tests, roasting videos & fun snack trends',
      url: 'https://www.tiktok.com/@ceyloncrunchlk?_r=1&_t=ZS-9APNpLNJ9l8',
      isExternal: true,
      icon: 'TikTok',
      category: 'social',
    },
    {
      id: 'facebook-community',
      title: 'Join Our Facebook Community',
      subtitle: 'Customer reviews, community specials & announcements',
      url: 'https://www.facebook.com/share/1ENWdAdxez/',
      isExternal: true,
      icon: 'Facebook',
      category: 'social',
    },
    {
      id: 'contact-page',
      title: 'Customer Care & Contact Us',
      subtitle: 'Call, email or visit us in Colombo',
      url: '/contact',
      isExternal: false,
      icon: 'PhoneCall',
      category: 'contact',
    },
    {
      id: 'our-story',
      title: 'Our Heritage & Sourcing Story',
      subtitle: 'Learn about our single-origin Sri Lankan journey',
      url: '/our-story',
      isExternal: false,
      icon: 'Sparkles',
      category: 'brand',
    },
  ],
};

