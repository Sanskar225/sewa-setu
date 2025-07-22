/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        loader: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(3.0)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.9' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        loader: 'loader 2.5s ease-in-out forwards',
        fadeUp: 'fadeUp 1s ease-out 1.3s forwards', // delay for loader finish
      },
    },
  },
  plugins: [],
};
