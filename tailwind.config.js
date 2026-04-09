/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    './src/config/**/*.json',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e14',
        primary: '#95aaff',
        'primary-dim': '#3766ff',
        secondary: '#c3f400',
        'surface-low': '#0f141a',
        'surface-high': '#1b2028',
        'surface-highest': '#232a33',
        'surface-variant': '#1b2028',
        'on-surface-variant': '#a8abb3',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        sm: '2px',
        md: '6px',
        xl: '12px',
      },
    },
  },
  plugins: [],
}
