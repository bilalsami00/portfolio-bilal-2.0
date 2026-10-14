/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config for next-optimized-images */

  // your config for other plugins or the general next.js here...
  reactStrictMode: true,
  // Lenis ships as ESM; transpile so the Pages router can consume it.
  transpilePackages: ["lenis"],
};

module.exports = nextConfig;

