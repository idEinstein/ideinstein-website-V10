/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // CRITICAL: Configure for SaaS application, not static site
  output: 'standalone', // Enable for Docker/serverless deployment
  
  // Webpack configuration
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    
    // Prevent client-side bundling of server-only modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false
      };
    }
    
    // Exclude archive directories from compilation
    config.module.rules.push({
      test: /\/_archive\/|\/1\.Archive\/|\/app\/api\/1\.Archive\//,
      loader: 'ignore-loader'
    });
    
    return config;
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ideinstein.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ]
  },

  // Security headers - handled by middleware.ts to avoid conflicts
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true
      }
    ];
  },

  // Server external packages (Next.js 15.4+ stable feature)
  serverExternalPackages: ['bcryptjs'],
  
  // Experimental features for Next.js 15.4+
  experimental: {
    // React 19 compatibility
    reactCompiler: false, // Disable React Compiler for now (still experimental)
    
    // Performance optimizations
    optimizeCss: true, // Re-enabled with critters dependency
    scrollRestoration: true,
    
    // PPR (Partial Prerendering) - Next.js 15 feature
    ppr: false, // Keep disabled for SaaS with dynamic content
    
    // Subresource Integrity - DISABLED for Vercel compatibility
    // sri: {
    //   algorithm: 'sha256',
    // },
  },

  // Turbopack configuration (stable in Next.js 15.4+)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },

  // Performance optimizations for SaaS
  poweredByHeader: false,
  compress: true,
  
  // CRITICAL: Disable static optimization for dynamic routes
  trailingSlash: false,
  
  // Environment variables that should be available at build time
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  }
};

module.exports = nextConfig;
