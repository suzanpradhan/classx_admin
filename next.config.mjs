/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'uatclassx.suzanpradhan.com.np',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
