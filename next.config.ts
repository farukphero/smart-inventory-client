const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://smart-inventory-server-gamma.vercel.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
