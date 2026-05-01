import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Drive Point Exchange brand colors
        dpe: {
          // Blue — anchored to DPE Navy (#0E1A56), shifted away from bright royal
          blue: {
            50: '#eef1fd',
            100: '#e0e6fb',
            200: '#c7d2f8',
            300: '#a3b5f3',
            400: '#7890ec',
            500: '#3b4bd4',
            600: '#2e36b8',
            700: '#1f2a8a',
            800: '#0E1A56', // Anchor DPE Navy (was royal #1934b5)
            900: '#060C38',
          },
          // Green from Upward Arrows / DPE accent (#2DB843)
          green: {
            50: '#edfcf0',
            100: '#d4f8db',
            200: '#aeefbc',
            300: '#78df92',
            400: '#46c666',
            500: '#2db843', // Anchor DPE Green
            600: '#1c942f',
            700: '#187528',
            800: '#165d23',
            900: '#134d1f',
          },
          // Dark gray for text
          gray: {
            50: '#f9fafb',
            100: '#f3f4f6',
            200: '#e5e7eb',
            300: '#d1d5db',
            400: '#9ca3af',
            500: '#6b7280',
            600: '#4b5563',
            700: '#374151', // Main text color
            800: '#1f2937',
            900: '#111827',
          }
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        heading: ['Satoshi', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "url('/hero-bg.jpg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'dpe': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'dpe-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 30px -10px rgba(16,24,40,.12)',
      },
      borderRadius: {
        'dpe': '12px',
      },
      animation: {
        rainbow: "rainbow var(--speed, 2s) infinite linear",
        "gradient-text-sweep": "gradient-text-sweep 2s linear infinite",
      },
      keyframes: {
        rainbow: {
          "0%": { "background-position": "0%" },
          "100%": { "background-position": "200%" },
        },
        "gradient-border": {
          "0%, 100%": { borderRadius: "37% 29% 27% 27% / 28% 25% 41% 37%" },
          "25%": { borderRadius: "47% 29% 39% 49% / 61% 19% 66% 26%" },
          "50%": { borderRadius: "57% 23% 47% 72% / 63% 17% 66% 33%" },
          "75%": { borderRadius: "28% 49% 29% 100% / 93% 20% 64% 25%" },
        },
        "gradient-1": {
          "0%, 100%": { top: "0", right: "0" },
          "50%": { top: "50%", right: "25%" },
          "75%": { top: "25%", right: "50%" },
        },
        "gradient-2": {
          "0%, 100%": { top: "0", left: "0" },
          "60%": { top: "75%", left: "25%" },
          "85%": { top: "50%", left: "50%" },
        },
        "gradient-3": {
          "0%, 100%": { bottom: "0", left: "0" },
          "40%": { bottom: "50%", left: "25%" },
          "65%": { bottom: "25%", left: "50%" },
        },
        "gradient-4": {
          "0%, 100%": { bottom: "0", right: "0" },
          "50%": { bottom: "25%", right: "40%" },
          "90%": { bottom: "50%", right: "25%" },
        },
        "gradient-text-sweep": {
          "0%": { "background-position": "100% 0" },
          "100%": { "background-position": "-200% 0" },
        },
      },
    },
  },
  plugins: [],
}

export default config
