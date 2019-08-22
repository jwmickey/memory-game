const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    stats: "errors-only",
    overlay: true,
    host: "localhost",
    port: 3000,
    hot: true,
    compress: true,
    contentBase: path.resolve('public'),
    writeToDisk: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new CopyWebpackPlugin([
      {
        from: "public",
        to: "",
        force: true,
      },
    ]),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          { 
            loader: 'react-hot-loader/webpack'
          }, 
          {
            loader: 'babel-loader'
          }
        ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
                javascriptEnabled: true
            }
          }
        ],
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: 'url-loader?limit=8192'
        }
      }
    ]
  }
};
