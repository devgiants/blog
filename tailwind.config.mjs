import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f8fafc',
          100: '#eef2ff',
          200: '#dbe4f0',
          300: '#bac7d8',
          400: '#8b9bb2',
          500: '#61748e',
          600: '#45556f',
          700: '#27344a',
          800: '#162030',
          900: '#0b1220',
        },
        sand: {
          50: '#fffdf7',
          100: '#fdf6e5',
          200: '#f5e7bf',
          300: '#e9d39a',
          400: '#d8b56b',
          500: '#c49333',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      boxShadow: {
        soft: '0 24px 80px rgba(15, 23, 42, 0.12)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [typography],
};
