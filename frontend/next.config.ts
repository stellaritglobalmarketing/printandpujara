import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The standalone portfolio page was removed; old links land on the homepage's recent-work section.
  async redirects() {
    return [{ source: "/portfolio/:path*", destination: "/#portfolio", permanent: false }];
  },
  // Shared hosting (Hostinger) caps processes and memory: build on one worker without extra worker threads.
  experimental: {
    cpus: 1,
    workerThreads: false,
    webpackMemoryOptimizations: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
