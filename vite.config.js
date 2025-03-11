import { defineConfig } from 'vite';


export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    rollupOptions: {
      input: {
        background: 'src/service-worker.js',
        popup: 'src/popup.html',
        content: 'src/content.js'
      },
      output: {
        entryFileNames: 'assets/[name].js',
      }
    }
  }
});
