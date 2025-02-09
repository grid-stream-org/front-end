import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    modulePreload: true,
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: id => {
          // UI Components
          if (id.includes('/components/ui/')) {
            return 'ui-components'
          }

          // Firebase related
          if (id.includes('firebase') || id.includes('@firebase')) {
            return 'firebase-vendor'
          }

          // Form related (react-hook-form, zod, etc)
          if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
            return 'form-vendor'
          }

          // Radix UI components
          if (id.includes('@radix-ui')) {
            return 'radix-vendor'
          }

          // Animation related
          if (id.includes('framer-motion')) {
            return 'animation-vendor'
          }

          // Core React and routing
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            // Utility libraries
            if (
              id.includes('tailwind-merge') ||
              id.includes('class-variance-authority') ||
              id.includes('clsx')
            ) {
              return 'utils-vendor'
            }
            // Other dependencies
            return 'deps-vendor'
          }
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
    dynamicImportVarsOptions: {
      warnOnError: true,
    },
  },
})
