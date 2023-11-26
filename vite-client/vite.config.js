import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: process.env.MEDIATOR_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
