import path from 'path'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import replace from '@rollup/plugin-replace'
import css from 'rollup-plugin-css-only'

import plugins from './base/plugins/index'

const DEMO_DIR = path.join(__dirname, '../demo')

export default defineConfig({
  input: path.join(DEMO_DIR, 'index.ts'),
  output: {
    file: path.join(DEMO_DIR, 'demo.js'),
    format: 'iife',
    name: 'demo',
    sourcemap: true,
  },
  plugins: [
    typescript(),
    css({ output: 'demo.css' }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development'),
      preventAssignment: true,
    }),
    serve({
      open: true,
      contentBase: DEMO_DIR,
      port: 8080,
    }),
    livereload({
      verbose: true,
      watch: DEMO_DIR,
    }),
  ].concat(plugins),
})
