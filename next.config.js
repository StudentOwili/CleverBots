const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Remove output: 'export' for Vercel deployment
  
  // Remove GitHub Pages configuration
  // basePath: `/LFG`,
  // assetPrefix: `/LFG/`,
  
  trailingSlash: true,
  
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('bak')),
};

module.exports = nextConfig;
