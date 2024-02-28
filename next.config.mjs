/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  env: {
    YT_API_KEY: process.env.YT_API_KEY,
  }
};

export default nextConfig;
