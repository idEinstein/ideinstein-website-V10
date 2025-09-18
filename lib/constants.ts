export const SITE_NAME = 'IdEinstein';
export const SITE_DESCRIPTION = 'Where Ideas Take Shape';

export const SERVICE_CATEGORIES = [
  'Engineering',
  'Design',
  'Manufacturing',
  'Simulation & Analysis',
  'Documentation',
  'Consulting'
] as const;

export const CONTACT_INFO = {
  email: 'info@ideinstein.com',
  phone: '+49 15255409314',
  whatsapp: '+4915255409314',
  address: 'Walter-Petri-Ring 49, 65232, Taunusstein, Germany',
  businessHours: 'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 2:00 PM CET',
  timezone: 'Central European Time (CET)'
};

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/ideinstein_de',
  linkedin: 'https://linkedin.com/company/ideinstein',
  facebook: 'https://facebook.com/ideinstein.engineering',
  instagram: 'https://instagram.com/ideinstein_engineering',
  youtube: 'https://youtube.com/@ideinstein',
  xing: 'https://xing.com/companies/ideinstein'
};

export const NAV_LINKS = [
  {
    title: 'Services',
    href: '/services',
    submenu: [
      {
        category: 'Engineering & Design',
        items: [
          { title: 'Research & Development', href: '/services/research-development' },
          { title: 'CAD Modeling', href: '/services/cad-modeling' },
          { title: 'Machine Design', href: '/services/machine-design' },
          { title: 'BIW Design', href: '/services/biw-design' }
        ]
      },
      {
        category: 'Analysis & Simulation',
        items: [
          { title: 'FEA & CFD Analysis', href: '/services/finite-element-cfd' },
          { title: 'GD&T and Tolerance Analysis', href: '/services/gdt-tolerance' }
        ]
      },
      {
        category: 'Manufacturing Solutions',
        items: [
          { title: '3D Printing Services', href: '/services/3d-printing' },
          { title: 'Supplier Sourcing', href: '/services/supplier-sourcing' }
        ]
      },
      {
        category: 'Documentation & Visualization',
        items: [
          { title: 'Technical Documentation', href: '/services/technical-documentation' }
        ]
      }
    ],
  },
  { title: 'Blog', href: '/blog' },
  { title: 'Store', href: '/store' },
  { title: 'About', href: '/about' },
  { title: 'Contact', href: '/contact' },
  { title: 'FAQ', href: '/faq' },
];

export const META = {
  title: {
    default: 'IdEinstein - Where Ideas Take Shape | Professional Engineering Services',
    template: '%s | IdEinstein'
  },
  description: 'Professional engineering services including 3D printing, CAD modeling, FEA/CFD analysis, and manufacturing solutions. Transform your innovative ideas into market-ready products.',
  keywords: [
    '3D Printing', 'Engineering Services', 'CAD Modeling', 'Manufacturing Solutions', 
    'Prototyping', 'FEA Analysis', 'CFD Analysis', 'Machine Design', 'BIW Design',
    'Technical Documentation', 'GD&T Analysis', 'Supplier Sourcing', 'Research Development',
    'Mechanical Engineering', 'Product Development', 'Engineering Consulting'
  ],
  authors: [{ name: 'IdEinstein Team' }],
  creator: 'IdEinstein',
  publisher: 'IdEinstein',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://ideinstein.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ideinstein.com',
    siteName: 'IdEinstein',
    title: 'IdEinstein - Where Ideas Take Shape | Professional Engineering Services',
    description: 'Professional engineering services including 3D printing, CAD modeling, FEA/CFD analysis, and manufacturing solutions. Transform your innovative ideas into market-ready products.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'IdEinstein - Professional Engineering Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IdEinstein - Where Ideas Take Shape',
    description: 'Professional engineering services including 3D printing, CAD modeling, FEA/CFD analysis, and manufacturing solutions.',
    images: ['/images/twitter-image.jpg'],
  },
  verification: {
    google: 'google-site-verification=your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with your GA4 ID
    googleTagManagerId: 'GTM-XXXXXXX', // Replace with your GTM ID
  },
};
