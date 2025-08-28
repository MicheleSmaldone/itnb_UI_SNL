/** @type {import('next').NextConfig} */
require('dotenv').config();

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Use local FastAPI backend by default, allow override via env var
    // In Docker environment, the backend is accessible via Docker host IP
    // For production deployment on Vercel, use Railway backend
    // For local development, use local backend
    const backendUrl = process.env.BACKEND_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://snlpoc-production.up.railway.app' 
        : 'http://172.17.0.1:8000');
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