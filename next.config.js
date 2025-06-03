/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during builds as we run it separately
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
