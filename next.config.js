/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'tmerwtjlourabodnafyn.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['ceyloncrunch.lk', 'localhost:3000'] },
  },
}

module.exports = nextConfig
