import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#faf6ee',
          100: '#f3e8d2',
          200: '#e6cfac',
          300: '#d6b47f',
          400: '#c79556',
          500: '#b97b3f',
        },
        bark: {
          50: '#f8f1ea',
          100: '#ecdcc9',
          200: '#dabb9a',
          300: '#c39568',
          400: '#a97649',
          500: '#855935',
        },
        pine: {
          50: '#eff6f2',
          100: '#d8e9df',
          200: '#b1d1bd',
          300: '#7db196',
          400: '#4d8a70',
          500: '#2f6655',
          600: '#224d41',
          700: '#18392f',
        },
        mist: {
          50: '#f5f7f8',
          100: '#e8edef',
          200: '#ccd8dd',
          300: '#acbdc6',
          400: '#8ba0ad',
          500: '#697c88',
          600: '#52626d',
        },
        lake: {
          50: '#eff6f7',
          100: '#d8e8ea',
          200: '#b7d3d8',
          300: '#88b2bb',
          400: '#5f909c',
          500: '#426f7b',
          600: '#315560',
        },
      },
      boxShadow: {
        soft: '0 18px 40px -24px rgba(45, 62, 47, 0.28)',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Aptos', 'Helvetica Neue', 'sans-serif'],
      },
      backgroundImage: {
        grain:
          'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.32) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
} satisfies Config;
