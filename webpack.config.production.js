const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: [ '.js' ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
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
          loader: 'url-loader?name=img/[hash].[ext]&limit=4096'
        }
      },
      {
        test: /\.html?$/,
        use: {
          loader: 'file-loader?name=[name].[ext]',
        },
        include: __dirname
      }
    ]
  }
};
