import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Configuration de l'optimiseur d'images
    ViteImageOptimizer({
      /* Options pour les JPG/JPEG */
      jpg: {
        quality: 70, // Réduit la taille sans perte visible de qualité
      },
      jpeg: {
        quality: 70,
      },
      /* Options pour les PNG */
      png: {
        quality: 70,
      },
      /* Options pour le format moderne WebP */
      webp: {
        lossless: false,
        quality: 70,
      },
      /* SVG */
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'sortAttrs',
            active: true,
          },
        ],
      },
    }),
  ],
})