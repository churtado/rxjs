var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'app': './app/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: [
          {
            loader: 'awesome-typescript-loader',
          } 
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
        template: 'app/index.html'
    })
  ]
};