/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(230, 20%, 95%)',
        text: 'hsl(220, 20%, 20%)',
        muted: 'hsl(220, 15%, 50%)',
        accent: 'hsl(140, 70%, 45%)',
        primary: 'hsl(210, 80%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        dark: {
          bg: 'hsl(220, 25%, 8%)',
          surface: 'hsl(220, 25%, 12%)',
          card: 'hsl(220, 25%, 15%)',
          text: 'hsl(220, 10%, 95%)',
          muted: 'hsl(220, 10%, 60%)',
        }
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      spacing: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(0, 0%, 0%, 0.08)',
        'modal': '0 10px 30px hsla(0, 0%, 0%, 0.15)',
        'dark-card': '0 4px 12px hsla(0, 0%, 0%, 0.3)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        'slideUp': 'slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}