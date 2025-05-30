/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.deso.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'node.deso.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'diamondapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.deso.org',
        port: '',
        pathname: '/**',
      },
      // Add other hostnames as identified
    ],
  },
};

// Conditionally enable bundle analyzer
import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
