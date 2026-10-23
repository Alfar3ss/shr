import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#F0C540', dark: '#d9ae2a' },
        ink: { DEFAULT: '#273F44', soft: '#2a4045', header: '#1e252d', footer: '#23393d' },
      },
      fontFamily: { sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'] },
      maxWidth: { page: '1240px' },
    },
  },
  plugins: [],
};
export default config;
