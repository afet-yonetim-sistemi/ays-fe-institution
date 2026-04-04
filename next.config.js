/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: 'standalone',
  turbopack: {},

  images: {
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
