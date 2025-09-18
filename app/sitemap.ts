import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Use environment variable for base URL, fallback to production domain
  const baseUrl = process.env.NEXTAUTH_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://ideinstein.com')
  
  // Static pages with priorities
  const staticPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/about', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/about/hub-spoke-model', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/blog', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/faq', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/solutions', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/solutions/for-startups', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/solutions/for-enterprises', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
    { path: '/impressum', priority: 0.3, changeFreq: 'yearly' as const },
  ]

  // Service pages
  const servicePages = [
    { path: '/services', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/services/research-development', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/cad-modeling', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/machine-design', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/biw-design', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/finite-element-cfd', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/gdt-tolerance', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/3d-printing', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/supplier-sourcing', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/technical-documentation', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/services/product-development-accelerator', priority: 0.9, changeFreq: 'monthly' as const },
  ]

  // Blog posts from JSON data
  const blogPosts = [
    { slug: 'future-of-3d-printing', date: '2024-01-15' },
    { slug: 'cad-modeling-best-practices', date: '2024-01-22' },
    { slug: 'gdt-tolerance-analysis-guide', date: '2024-01-28' },
    { slug: 'sustainable-manufacturing-practices', date: '2024-02-05' },
    { slug: 'biw-design-automotive-trends', date: '2024-02-12' },
    { slug: 'fea-cfd-simulation-guide', date: '2024-02-18' },
  ]

  const currentDate = new Date()

  return [
    // Static pages
    ...staticPages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })),
    
    // Service pages
    ...servicePages.map((page) => ({
      url: `${baseUrl}${page.path}`,
      lastModified: currentDate,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    })),

    // Blog posts
    ...blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}