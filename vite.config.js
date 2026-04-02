import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  
  base: "/bazzarnet.ecom/",

  server: {
    host: '0.0.0.0',
    port: 5173,
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/main.jsx',
        'src/App.jsx',
        'src/routes/**',
        'src/context/**',
        'src/hooks/**',
        'src/services/**',
        'src/utils/**',
        'src/assets/**',
        'src/components/Loader.jsx',
        'src/components/LoginButton.jsx',
        'src/components/SkeletonCard.jsx',
        'src/components/SkeletonStoreCard.jsx',
        'src/components/SkeletonText.jsx',
      ],
    },
  },
})