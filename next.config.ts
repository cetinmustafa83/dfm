import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chart.googleapis.com',
        pathname: '/chart/**',
      },
    ],
  },
  // Use standalone output to skip static optimization
  output: 'standalone',
  // Force cache invalidation for deployment
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  // Disable webpack cache during build
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.cache = false;
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
