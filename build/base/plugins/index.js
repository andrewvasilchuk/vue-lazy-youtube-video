import common from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

/** @type {import('rollup').RollupOptions['plugins']} */
const plugins = [common(), resolve()]

export default plugins
