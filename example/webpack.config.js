const path = require("path");
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './app.tsx'
  ],
  output: {
    pathinfo: true,
    filename: './bundle.js',
    publicPath: '/'
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    extensions: [ '.webpack.js', '.web.js', '.ts', '.js', '.tsx']
  },
  module: {
    loaders: [
      { test: /\.ts.?$/, loader: 'ts-loader' },
      {
        test: /\.html$/,
        loader: 'html-loader',
        query: {
          attrs: ['link:href'],
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
}