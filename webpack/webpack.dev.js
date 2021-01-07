const { merge } = require('webpack-merge')
const common = require('./webpack.config.js')
const path = require('path');
const webpack = require('webpack')
const threadLoader = require('thread-loader');
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();

const cssWorkerPool = {
  workerParallelJobs: 2,
  poolTimeout: 2000
};
threadLoader.warmup(cssWorkerPool, ['css-loader', 'postcss-loader']);

module.exports = merge(common, {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css|\.sass|\.scss$/,
        use: [
          'style-loader',
          'cache-loader',
          {
            loader: 'thread-loader',
            options: cssWorkerPool
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: (loader) => [
                new IconfontWebpackPlugin(loader)
              ]
            }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
          outputPath: 'assets',
        },
      },
    ]
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
      'VERSION': JSON.stringify(gitRevisionPlugin.version()),
      'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
      'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
  ],
  devtool:"eval-cheap-module-source-map",
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, "./dist"),
    host: "0.0.0.0", // 可以使用手机访问
    port: 8080,
    historyApiFallback: true, // 该选项的作用所有的404都连接到index.html
    proxy: {
      // 代理到后端的服务地址，会拦截所有以api开头的请求地址
      "/api": "http://localhost:3000"
    }
  },
})