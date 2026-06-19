module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#00a3ff',
        danger: '#ff4757',
        success: '#2ed573',
        warning: '#ffa502',
        light: '#f1f2f6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
}
