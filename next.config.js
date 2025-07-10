/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Use production backend URL by default, allow override via env var
    const backendUrl = process.env.BACKEND_URL || 'https://backend-concierge-itnb.pub.production.kvant.cloud';
    console.log(`Using backend URL: ${backendUrl}`);
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`
      }
    ]
  }
}

module.exports = nextConfig 