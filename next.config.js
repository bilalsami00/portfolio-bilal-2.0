/** @type {import('next').NextConfig} */

const nextConfig = {
  /* config for next-optimized-images */

  // your config for other plugins or the general next.js here...
  reactStrictMode: true,
  // Lenis ships as ESM; transpile so the Pages router can consume it.
  transpilePackages: ["lenis"],
  async headers() {
    return [
      {
        source: "/resume/Updated_Full_CV.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Updated_Full_CV.pdf"',
          },
          {
            key: "Content-Type",
            value: "application/pdf",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
