module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      screens: {
        md: '850px'
      }
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
