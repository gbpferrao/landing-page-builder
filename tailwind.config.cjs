/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#171412",
          800: "#332d29",
          600: "#625852"
        },
        paper: "#f7f4ef",
        surface: "#fffdfa",
        muted: "#625852",
        line: "#ded6ca",
        gold: {
          600: "#a97728",
          500: "#bd8a3c"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 20, 18, 0.10)"
      }
    }
  },
  plugins: []
};
