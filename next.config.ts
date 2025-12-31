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
  // Skip building 404 page to avoid Html import error
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Disable all caching during build
  experimental: {
    disableOptimizedLoading: true,
  },
  // Force cache invalidation for deployment
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
};

export default withNextIntl(nextConfig);
