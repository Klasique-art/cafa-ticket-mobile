/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#050E3C",
        secondary: "#002455",
        accent: "#DC0000",
        accent50: "#FF5555",
      },
      fontFamily: {
        iblack: ["Inter-Black", "sans-serif"],
        ibold: ["Inter-Bold", "sans-serif"],
        isemibold: ["Inter-SemiBold", "sans-serif"],
        imedium: ["Inter-Medium", "sans-serif"],
        iregular: ["Inter-Regular", "sans-serif"],
        ilight: ["Inter-Light", "sans-serif"],
        ithin: ["Inter-Thin", "sans-serif"],
        iextralight: ["Inter-ExtraLight", "sans-serif"],
        iextrabold: ["Inter-ExtraBold", "sans-serif"],
      }
    },
  },
  plugins: [],
}