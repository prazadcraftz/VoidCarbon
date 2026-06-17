import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake icon and chart libraries — only bundle what's imported (EFF-06)
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
