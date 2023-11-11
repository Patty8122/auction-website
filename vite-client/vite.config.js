import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/auction': {
        target: process.env.AUCTION_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auction/, '')
      },
      '/user': {
        target: process.env.USER_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/user/, '')
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
