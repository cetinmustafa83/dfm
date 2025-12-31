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
  // Force cache invalidation for deployment
  generateBuildId: async () => {
    return `build-${Date.now()}`
  },
  // Override webpack to prevent HtmlContext import
  webpack: (config, { isServer, webpack }) => {
    if (isServer) {
      config.cache = false;

      // Add fallback for problematic modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
      };

      // Ignore the vendored contexts that cause issues
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /vendored\/contexts/,
        })
      );
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
