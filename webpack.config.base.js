const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const include = path.resolve(__dirname, './src/scripts');
const exclude = /node_modules/;

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: ['./src/index'],
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.ts?$/,
        include,
        exclude,
        options: {
          babelrc: true,
        },
      },
      {
        loader: 'ts-loader',
        test: /\.ts?$/,
        include,
        exclude
      }
    ],
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: [new ESLintPlugin({
    context: include,
    files: '**/*.js',
    exclude: 'node_modules',
    quiet: true
  })],
  output: {
    library: 'Choices',
    libraryTarget: 'window',
    libraryExport: 'default',
    globalObject: 'window',
  },
};
