var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  devServer: {
    contentBase: "./dist",
    noInfo: true, //  --no-info option
    hot: true,
    inline: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
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
