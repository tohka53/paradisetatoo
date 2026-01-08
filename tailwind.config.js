/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'paradise-black': '#050505',
        'paradise-dark': '#0f0f0f',
        'paradise-gray': '#1a1a1a',
        'paradise-yellow': '#ffd000',
        'paradise-gold': '#ffb700',
        'paradise-amber': '#ff9500',
        'paradise-white': '#fafafa',
      },
      fontFamily: {
        'display': ['Bebas Neue', 'sans-serif'],
        'accent': ['Cormorant Garamond', 'serif'],
        'body': ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
