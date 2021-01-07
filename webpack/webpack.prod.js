const { merge } = require('webpack-merge')
const common = require('./webpack.config.js') 
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const path = require('path');
const glob = require('glob')
const IconfontWebpackPlugin = require('iconfont-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.css|\.sass|\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
          name: 'assets/[name].[ext]',
          publicPath: path.join(__dirname, "./dist/"),
        },
      },
    ]
  },
  plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new webpack.DefinePlugin({
        PRODUCTION: JSON.stringify(true),
        'VERSION': JSON.stringify(gitRevisionPlugin.version()),
        'COMMITHASH': JSON.stringify(gitRevisionPlugin.commithash()),
        'BRANCH': JSON.stringify(gitRevisionPlugin.branch()),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new PurgeCSSPlugin({
        paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`,  { nodir: true }),
      }),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin({
      test: /\.js(\?.*)?$/i,
    })],
    splitChunks: {
      minSize: { javascript: 20000, "css/mini-extra": 10000 },
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  devtool:"source-map",
  
})