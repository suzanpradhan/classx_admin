/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'classxpresentation.suzanpradhan.com.np',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
