import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 5000,
    rolldownOptions: { input: { index: './index.html', mock: './mock.html' } }
  },
  server: { port: 3000 },
  resolve: {
    alias: {
      '@axonivy/user-editor': resolve(import.meta.dirname, '../../packages/editor/src'),
      '@axonivy/user-editor-protocol': resolve(import.meta.dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
