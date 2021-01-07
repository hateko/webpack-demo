const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const threadLoader = require('thread-loader');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const GitRevisionPlugin = require("git-revision-webpack-plugin");

const jsWorkerPool = {
  poolTimeout: 2000
};
threadLoader.warmup(jsWorkerPool, ['babel-loader']);



module.exports = {
  entry: {
    app: {
      import: path.join(__dirname, '../src/app.js'), 
      dependOn: "vendor",
    },
    vendor: ["react", "react-dom"],
  },
  output: {
    filename: '[name].[bundle].js',
    path: path.join(__dirname, '../dist'),  
  },

  module:{
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          'cache-loader',
          {
            loader: 'thread-loader',
            options: jsWorkerPool
          },
          'babel-loader',
        ],
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'assets',
              publicPath: path.join(__dirname, "./dist/fonts/"),
            }
          }
        ]
      }
    ]
  },
  plugins:[
    new WebpackNotifierPlugin({title: function (params) {
      return `Build status is ${params.status} with message ${params.message}`;
    }}),
    new CaseSensitivePathsPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html', // 最终创建的文件名
      template: path.join(__dirname, '../src/index.html') // 指定模板路径
    }),
    new webpack.ProvidePlugin({
      TK: 'TK',
    }),
    new GitRevisionPlugin()
  ],
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      "@": path.join(__dirname, "src"),
      pages: path.join(__dirname, "src/pages"),
      router: path.join(__dirname, "src/router")
    }
  },
}
