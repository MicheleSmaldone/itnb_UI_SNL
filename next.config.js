/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Use local FastAPI backend by default, allow override via env var
    // In Docker environment, the backend is accessible via Docker host IP
    const backendUrl = process.env.BACKEND_URL || 'http://172.17.0.1:8000'; 
    // 'https://backend-concierge-itnb.pub.production.kvant.cloud';
    //const backendUrl ='http://172.17.0.1:8000';
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