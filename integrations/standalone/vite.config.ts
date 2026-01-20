import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
const ENGINE_URL = process.env.BASE_URL ?? 'http://localhost:8081/';

export default defineConfig({
  plugins: [react(), svgr()],
  build: { outDir: 'build', chunkSizeWarningLimit: 5000, rollupOptions: { input: { index: './index.html', mock: './mock.html' } } },
  server: { port: 3000 },
  resolve: {
    alias: {
      '@axonivy/user-editor': resolve(__dirname, '../../packages/editor/src'),
      '@axonivy/user-editor-protocol': resolve(__dirname, '../../packages/protocol/src')
    }
  },
  base: './'
});
