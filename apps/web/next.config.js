/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // để Dockerize gọn (server.js)
  reactStrictMode: true,
};
module.exports = nextConfig;
