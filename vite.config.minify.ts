import { defineConfig } from 'vite'
import babelPlugin from '@rollup/plugin-babel'
import path from 'node:path'

export default defineConfig({
  plugins: [
    babelPlugin({
      babelHelpers: 'bundled',
    }),
  ],

  build: {
    lib: {
      entry: path.resolve(__dirname, 'dist/vue-lazy-youtube-video.js'),
      formats: ['umd'],
      name: 'VueLazyYoutubeVideo',
      fileName: () => 'vue-lazy-youtube-video.min.js',
    },
    emptyOutDir: false,
    minify: 'terser',
    terserOptions: {
      format: { comments: false },
    },
  },
})
