/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
      {
        source: "/ws",
        destination: "http://127.0.0.1:8000/ws",
      },
      {
        source: "/stream",
        destination: "http://127.0.0.1:8000/stream",
      },
    ];
  },
};

module.exports = nextConfig;
