/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edfaf4',
          100: '#d5f2e5',
          200: '#aee4cc',
          300: '#7cd1ae',
          400: '#48b78d',
          500: '#1D9E75',
          600: '#17805f',
          700: '#12654b',
          800: '#0d4a37',
          900: '#083024',
        },
        coral: {
          50: '#fef3f0',
          100: '#fde1da',
          200: '#fcc5b6',
          300: '#f9a08a',
          400: '#f07a5b',
          500: '#E8593C',
          600: '#c7442a',
          700: '#a33621',
          800: '#7f2a1a',
          900: '#5c1e13',
        },
        cream: '#F5F5F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
      },
    },
  },
  plugins: [],
};
