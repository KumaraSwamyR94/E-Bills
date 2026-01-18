/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#64748B',
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#D97706',
        light: '#F3F4F6',
        dark: '#1F2937',
      }
    },
  },
  plugins: [],
}
