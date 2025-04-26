import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import autoImport from 'unplugin-auto-import/vite';
import Inspect from 'vite-plugin-inspect';
import { visualizer } from 'rollup-plugin-visualizer';



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    Inspect(),
    autoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-imports.d.ts',
    }),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: './temp/test.html',
      open: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
