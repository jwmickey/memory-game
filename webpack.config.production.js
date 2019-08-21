var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: [ '.js' ]
  },
  plugins: [
//    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
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
          loader: 'url-loader?name=img/[name].[ext]&limit=8192'
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
