/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  swcMinify: true,

  experimental: {
    // turbo: {}, // Disabled due to build issues with class inheritance

    optimizePackageImports: ['lucide-react', 'react-icons'],
  },

  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  poweredByHeader: false,

  compress: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: false,
  },

  modularizeImports: {
    lodash: {
      transform: 'lodash/{{member}}',
    },
  },

  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },
}

export default nextConfig
