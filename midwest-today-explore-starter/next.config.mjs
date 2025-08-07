// Next.js config. We avoid setting X-Frame-Options so the app can be embedded.
// You may tighten the CSP 'frame-ancestors' directive to your Squarespace domain.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.squarespace.com https://midwesttoday.com https://www.midwesttoday.com"
          }
        ]
      }
    ];
  }
};
export default nextConfig;