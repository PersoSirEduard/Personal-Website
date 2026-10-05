// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"EB Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        parchment: '#efe7d6',
        vellum: '#f7f1e5',
        rule: '#b9a88f',
        ink: {
          DEFAULT: '#2b2622',
          soft: '#4d443d',
          faint: '#8a7a6a',
        },
        sanguine: '#9a4b32',
      },
    },
  },
  plugins: [],
}
