/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pride: {
          red: '#E40303',
          orange: '#FF8C00',
          yellow: '#FFED00',
          green: '#008026',
          blue: '#004CFF',
          purple: '#732982',
          pink: '#FF6FB5',
          turquoise: '#00C2B8',
        },
        brand: {
          teal: {
            DEFAULT: '#0B485B',
            dark: '#083A4A',
            soft: '#E5F0F3',
          },
          plum: {
            DEFAULT: '#6B3F58',
            soft: '#F4ECF1',
          },
          gold: {
            DEFAULT: '#B8862E',
          },
        },
      },
      fontFamily: {
        sans: ['"Geist"', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Geist"', 'Arial', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(115, 41, 130, 0.45)',
        card: '0 20px 60px -20px rgba(15, 23, 42, 0.25)',
      },
      backgroundImage: {
        'pride-gradient':
          'linear-gradient(135deg, #E40303 0%, #FF8C00 18%, #FFED00 36%, #008026 54%, #004CFF 72%, #732982 100%)',
        'sunset-gradient':
          'linear-gradient(135deg, #FF6FB5 0%, #FF8C00 50%, #FFED00 100%)',
        'aurora':
          'radial-gradient(at 20% 10%, rgba(255,111,181,0.55) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(0,194,184,0.45) 0px, transparent 50%), radial-gradient(at 30% 90%, rgba(115,41,130,0.45) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(255,140,0,0.45) 0px, transparent 50%)',
      },
      animation: {
        'gradient-x': 'gradientX 8s ease infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pop-in': 'popIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        popIn: {
          '0%': { opacity: 0, transform: 'translateY(12px) scale(0.98)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
