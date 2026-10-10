import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { defineConfig } from 'vite'

// Produces one self-contained dist-artifact/index.html (CSS + JS inlined,
// no separate chunk files) for publishing as a Cowork Artifact — a quick,
// zero-setup way to get PortfolioHub live at a shareable link. The regular
// `npm run build` (vite.config.js) stays code-split and is what you deploy
// to Firebase Hosting or any other real host.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    cssCodeSplit: false,
    rollupOptions: {
      input: 'index.artifact.html',
    },
  },
})
