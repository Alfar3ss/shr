import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Temporary: images still served by the old WordPress site.
      // Download them into /public/images and remove this host when the old site goes away.
      { protocol: 'https', hostname: 'carrentmorocco.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
};

export default withNextIntl(nextConfig);
