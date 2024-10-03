import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#39FF14',
          blue: '#00FFFF',
          pink: '#FF10F0',
        },
      },
      animation: {
        glow: 'glow 1s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #39FF14, 0 0 20px #39FF14, 0 0 35px #39FF14, 0 0 40px #39FF14, 0 0 50px #39FF14, 0 0 75px #39FF14' },
          to: { textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #39FF14, 0 0 40px #39FF14, 0 0 70px #39FF14, 0 0 80px #39FF14, 0 0 100px #39FF14, 0 0 150px #39FF14' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
export default config;
