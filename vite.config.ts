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
          exclude: ['src/test/**', 'src/**/*.stories.tsx', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
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
            // Mark the whole bundle as a client module so it can be imported
            // from React Server Components (Next.js App Router). Prepended as
            // raw text, so it survives minification and stays the first line.
            banner: '"use client";',
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

  // showcase playground (test config lives in vitest.config.ts)
  return {
    plugins: [react()],
    resolve: {
      alias: { liquidkit: resolve(__dirname, 'src/index.ts') },
    },
    build: { outDir: 'dist-site' },
    server: {
      // Don't watch build output or the agent's worktree copies (avoids
      // exhausting the inotify watcher limit).
      watch: { ignored: ['**/.claude/**', '**/dist/**', '**/dist-site/**', '**/coverage/**'] },
    },
  }
})
