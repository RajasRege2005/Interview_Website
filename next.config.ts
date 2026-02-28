import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Suppress cache warnings by adjusting infrastructure logging
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
  serverExternalPackages: ['@mediapipe/tasks-vision'],
};

export default nextConfig;
