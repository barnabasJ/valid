const { resolve } = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/index.ts',
  output: {
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
    chunkLoading: false,
    wasmLoading: false,
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@src': resolve(__dirname, './src'),
    },
  },
}
