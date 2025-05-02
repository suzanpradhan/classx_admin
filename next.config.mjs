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
      {
        protocol: 'http',
        hostname: 'uatclassx.suzanpradhan.com.np',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'event.suzanpradhan.com.np',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
