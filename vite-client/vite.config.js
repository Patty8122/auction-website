import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/auction': {
        target: process.env.AUCTION_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auction/, '')
      }
    }
  }
  // ... other Vite config options
});
