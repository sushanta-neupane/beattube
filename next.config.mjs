/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URI: process.env.API_URI,
  },
};

export default nextConfig;
