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
  async rewrites() {
    return [
      {
        source: '/back/api/:path*',
        destination: 'http://localhost:8000/api/:path*' // 替换为你的后端服务地址
      }
    ]
  }
};

module.exports = nextConfig;
