import common from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import vue from 'rollup-plugin-vue'

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [common(), resolve(), vue({ needMap: false })]

export default plugins
