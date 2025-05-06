/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // 👈 ensures ESLint runs
  },
};

module.exports = nextConfig;
