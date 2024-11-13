const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {

      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist-webpack'),
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  externals: {
    'uart': 'commonjs uart', // Prevent Webpack from bundling 'uart'
    'rtc': 'commonjs rtc', // Prevent Webpack from bundling 'rtc'
    'gpio': 'commonjs gpio', // Prevent Webpack from bundling 'gpio'
    'spi': 'commonjs spi', // Prevent Webpack from bundling 'spi'
    'button': 'commonjs button', // Prevent Webpack from bundling 'adc'
    'fs': 'commonjs fs', // Prevent Webpack from bundling 'fs'
  },
};