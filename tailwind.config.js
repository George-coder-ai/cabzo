/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0F17',
          charcoal: '#111827',
          surface: '#1E293B',
          'surface-hover': '#24334A',
          'surface-light': '#2A3B54',
          cyan: '#00A6FF',
          'cyan-hover': '#0090DE',
          'cyan-glow': 'rgba(0, 166, 255, 0.25)',
          orange: '#F97316',
          'orange-glow': 'rgba(249, 115, 22, 0.25)',
          text: '#F8FAFC',
          muted: '#94A3B8',
          subtle: '#64748B',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-active': 'rgba(0, 166, 255, 0.4)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 166, 255, 0.35)',
        'glow-orange': '0 0 20px -3px rgba(249, 115, 22, 0.35)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'drawer': '0 -10px 35px -5px rgba(0, 0, 0, 0.6), 0 -1px 0 rgba(255, 255, 255, 0.08)',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        carPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.08)' },
        }
      },
      animation: {
        'radar': 'radar 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'car-pulse': 'carPulse 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
