import path from 'path'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import { terser } from 'rollup-plugin-terser'

import basePlugins from './base/plugins/index'

const SOURCE = path.join(__dirname, '../src/index.ts')
const DIST_DIR = 'dist'
const FILE_NAME = 'vue-lazy-youtube-video'
const name = 'VueLazyYoutubeVideo'
const external = ['vue']
const globals = {
  vue: 'Vue',
}
const plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
  }),
].concat(basePlugins)

export default [
  defineConfig({
    input: SOURCE,
    external,
    output: [
      {
        file: `${DIST_DIR}/${FILE_NAME}.js`,
        format: 'umd',
        exports: 'named',
        globals,
        name,
      },
      {
        file: `${DIST_DIR}/${FILE_NAME}.common.js`,
        exports: 'named',
        format: 'cjs',
      },
      {
        file: `${DIST_DIR}/${FILE_NAME}.esm.js`,
        format: 'esm',
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.prod.json',
      }),
    ].concat(plugins),
  }),
  defineConfig({
    input: SOURCE,
    external,
    output: {
      file: `${DIST_DIR}/${FILE_NAME}.min.js`,
      format: 'umd',
      exports: 'named',
      globals,
      name,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.prod.umd.json',
      }),
      terser({ output: { comments: false } }),
    ].concat(plugins),
  }),
]
