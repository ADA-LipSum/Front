import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('tech-stack-icons')) return 'vendor-icons';
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          if (id.includes('lucide-react') || id.includes('swiper')) return 'vendor-ui';
          if (id.includes('axios') || id.includes('zustand') || id.includes('react-toastify')) return 'vendor-misc';
        },
      },
    },
  },
});
