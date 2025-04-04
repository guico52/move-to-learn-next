/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  transpilePackages: ['@monaco-editor/react'],
  postcss: true,
  images: {
    domains: ['picsum.photos', 'minio.guico.tech'],
  },
};

module.exports = nextConfig;
