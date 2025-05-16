/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  transpilePackages: ['@monaco-editor/react'],
  images: {
    domains: ['picsum.photos', 'minio.guico.tech'],
    unoptimized: true
  },
};

module.exports = nextConfig;
