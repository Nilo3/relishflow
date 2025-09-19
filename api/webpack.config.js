const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/serverless.ts',
  target: 'node',
  mode: 'production',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
      'src': path.resolve(__dirname, 'src'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist/src'),
    filename: 'serverless.js',
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: false,
    nodeEnv: false,
  },
};