// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {  reactStrictMode: true,
  // Eliminar swcMinify ya que no es reconocido en tu versión de Next.js
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename]
        },
        // Usar ruta absoluta para cacheDirectory
        cacheDirectory: path.resolve(__dirname, '.next/cache'),
        maxAge: 172800000 // 2 días en milisegundos
      };
    }
    return config;
  },
};

module.exports = nextConfig;
