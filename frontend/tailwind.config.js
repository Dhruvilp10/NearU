/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        ink: '#1B2A2F',
        amber: '#E8A33D',
        route: '#2F6F5E',
        clay: '#C1503F',
        hairline: '#D8D3C7',
      },
      fontFamily: {
        display: ['Archivo', 'sans-serif'],
        body: ['"Work Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}