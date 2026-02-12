import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Suppress cache warnings by adjusting infrastructure logging
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  }
};

export default nextConfig;
