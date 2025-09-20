import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { chromeExtensionPlugin } from './vite-plugin-chrome-extension';

export default defineConfig({
  plugins: [react(), chromeExtensionPlugin()],
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'src/pages/sidepanel/index.html'),
        popup: resolve(__dirname, 'src/pages/popup/index.html'),
        options: resolve(__dirname, 'src/pages/options/index.html'),
        background: resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          if (name === 'background') return 'background.js';
          if (name === 'sidepanel') return 'sidepanel.js';
          if (name === 'popup') return 'popup.js';
          if (name === 'options') return 'options.js';
          return `${name}.js`;
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return '[name].css';
          }
          return 'assets/[name]-[hash].[ext]';
        },
        format: 'es',
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});
