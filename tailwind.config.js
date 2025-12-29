module.exports = {
  content: ["./assets/**/*.js", "./src/css/*.css"],
  darkMode: 'selector',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
}
