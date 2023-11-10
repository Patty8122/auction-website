import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/auction': {
        target: process.env.AUCTION_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auction/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
