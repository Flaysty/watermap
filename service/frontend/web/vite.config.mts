import browserslistToEsbuild from 'browserslist-to-esbuild'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isDevMode = mode === 'development'
  const esbuildTarget = browserslistToEsbuild()

  return {
    optimizeDeps: {
      esbuildOptions: {
        target: esbuildTarget,
      },
    },
    esbuild: {
      // https://github.com/vitejs/vite/issues/8644#issuecomment-1159308803
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
    plugins: [
      tanstackRouter(),
      react({
        babel: {
          parserOpts: {
            plugins: ['decorators'],
          },
          plugins: [],
        },
      }),
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: isDevMode,
      rollupOptions: {
        output: {
          entryFileNames: 'js/[name]_[hash:8].js',
          chunkFileNames: 'js/[name]_[hash:8].js',
          hashCharacters: 'base36',
        },
      },
      target: esbuildTarget,
    },
    server: {
      port: 3001,
    },
  }
})
