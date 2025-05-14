/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Use the Docker bridge network IP to access host
    const backendUrl = process.env.BACKEND_URL || 'http://172.17.0.1:8000';
    console.log(`Using backend URL: ${backendUrl}`);
    
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`
      }
    ]
  }
}

module.exports = nextConfig 