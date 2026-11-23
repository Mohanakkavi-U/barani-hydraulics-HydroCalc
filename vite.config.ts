import { defineConfig } from 'vite';
// Base set to './' for Electron compatibility

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    strictPort: false,
    host: 'localhost',
    open: true,
    watch: {
      usePolling: true
    }
  },
  preview: {
    port: 5173,
    strictPort: false,
    host: 'localhost',
    open: true
  },
});
