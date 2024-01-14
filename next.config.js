/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tr.rbxcdn.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
