import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: [
    "172.20.10.4:3000",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
  images: {
    qualities: [75, 90, 95],
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/fr/admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/fr/admin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
      {
        source: "/en/admin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/en/admin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
      {
        source: "/fradmin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/fradmin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
      {
        source: "/enadmin",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/enadmin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
      {
        source: "/apple-touch-icon.png",
        destination: "/sepela-logo.png",
        permanent: false,
      },
      {
        source: "/apple-touch-icon-precomposed.png",
        destination: "/sepela-logo.png",
        permanent: false,
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ["**/node_modules"],
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/softbackground.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path(.*\\.(?:jpg|jpeg|png|webp|avif|ico|svg|woff2?))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
