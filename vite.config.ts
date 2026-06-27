/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

// `vite` / `vite build --mode site`  -> dev + build the showcase playground
// `vite build --mode lib`            -> build the distributable library
export default defineConfig(({ mode }) => {
  if (mode === 'lib') {
    return {
      plugins: [
        react(),
        dts({
          include: ['src'],
          exclude: [
            'src/test/**',
            'src/**/*.stories.tsx',
            'src/**/*.test.ts',
            'src/**/*.test.tsx',
          ],
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'LiquidKit',
          formats: ['es', 'cjs'],
          fileName: (format) => `liquidkit.${format === 'es' ? 'js' : 'cjs'}`,
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: { react: 'React', 'react-dom': 'ReactDOM' },
            assetFileNames: (info) =>
              info.name === 'style.css' ? 'liquidkit.css' : (info.name ?? 'asset'),
          },
        },
        sourcemap: true,
        emptyOutDir: true,
      },
    }
  }

  // showcase playground
  return {
    plugins: [react()],
    resolve: {
      alias: { liquidkit: resolve(__dirname, 'src/index.ts') },
    },
    build: { outDir: 'dist-site' },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      css: true,
    },
  }
})
