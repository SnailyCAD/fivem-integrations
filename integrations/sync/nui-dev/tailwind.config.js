/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@snailycad/ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16151a",
        secondary: "#35343c",
        tertiary: "#1f1e26",
        quaternary: "#2f2e34",
        quinary: "#454349",
      },
      animation: {
        enter: "enter 200ms ease-out",
      },
      keyframes: {
        enter: {
          "0%": { transform: "translateY(-4px)", opacity: 0 },
          "100%": { transform: "translateY(0px)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
