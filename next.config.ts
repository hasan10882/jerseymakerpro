/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true // ✅ Skip ESLint during Vercel build
  }
};

export default nextConfig;
