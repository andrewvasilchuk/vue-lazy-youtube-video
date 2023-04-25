import { defineConfig } from 'vite'
import vuePlugin from '@vitejs/plugin-vue'
import path from 'node:path'
import typescriptPlugin from '@rollup/plugin-typescript'

export default defineConfig({
  plugins: [vuePlugin()],

  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'istanbul',
    },
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'VueLazyYoutubeVideo',
      fileName: (format) =>
        [
          'vue-lazy-youtube-video',
          format === 'umd' || format === 'es' ? '' : format,
          format === 'es' ? 'mjs' : 'js',
        ]
          .filter(Boolean)
          .join('.'),
    },
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
      plugins: [
        typescriptPlugin({
          tsconfig: './tsconfig.prod.json',
        }),
      ],
    },
  },
})
