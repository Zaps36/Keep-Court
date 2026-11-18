import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this project from https://<user>.github.io/Keep-Court/,
// so the built asset URLs need that prefix. The deploy workflow sets
// BASE_PATH; local dev and local builds stay at the root.
const base = process.env.BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
