import path from 'path';
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/charts.js'),
      name: 'ifg-charts',
      fileName: (format) => `ifg-charts.${format}.js`
    }
  },
  server: {
    open: '/dev.html',
  }
})
