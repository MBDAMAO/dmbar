/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/index.html", // 如果项目有 index.html
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Vue 文件及其他模板文件
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
