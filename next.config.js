const isVercel = process.env.VERCEL === '1';
const repoName = 'CleverBots';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'export',
  trailingSlash: true,

  ...(isVercel
    ? {} // No basePath or assetPrefix on Vercel
    : {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }),

  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('bak')),
};

module.exports = nextConfig;
