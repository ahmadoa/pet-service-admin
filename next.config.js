/** @type {import('next').NextConfig} */
const nextConfig = {
  modularizeImports: {
    "@radix-ui": {
      transform: "@radix-ui/{{member}}",
    },
    "@emotion": {
      transform: "@emotion/{{member}}",
    },
    "react-icons/?(((w)?/?)*)": {
      transform: "react-icons/{{ matches.[1] }}/{{member}}",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
