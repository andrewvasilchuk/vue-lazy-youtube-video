import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import base from './webpack.config.base'

const config: webpack.Configuration = {
  entry: path.join(__dirname, '../demo/index.js'),
  output: {
    path: path.resolve(__dirname, '../demo'),
    filename: 'demo.js'
  },
  devServer: {
    contentBase: path.join(__dirname, '../demo'),
    port: 3000
  }
}

export default merge(base, config)
