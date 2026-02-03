import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Corrige explicitement l'URL avec double slash
      {
        source: "/:slash(\\/+)+riot.txt",
        destination: "/riot.txt",
      },
    ];
  },
};

export default nextConfig;
