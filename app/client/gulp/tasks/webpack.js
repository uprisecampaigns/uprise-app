"use strict";

const gulp = require('gulp');
const notify = require('gulp-notify');
const env = require('gulp-environments');
const del = require('del');
const path = require('path');
const webpack = require('webpack');
const gulpWebpack = require('gulp-webpack');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");

const config = require('config/gulp.js');

const extractTextPlugin = new ExtractTextPlugin('[name].css');

const occurenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin()

const commonsChunkPlugin = new CommonsChunkPlugin({
  names: ['fonts-loader'],
  minChunks: Infinity,
});

const bundleAnalyzerPlugin = new BundleAnalyzerPlugin();

const htmlWebpackPlugin = new HtmlWebpackPlugin({
	template: HtmlWebpackTemplate,
	title: 'Uprise app',
	appMountId: 'app', // Generate #app where to mount
	mobile: true, // Scale page on mobile
	inject: false // html-webpack-template requires this to work
})

const definePlugin = new webpack.DefinePlugin({
	'process.env': {
		'NODE_ENV': JSON.stringify('production')
	}
});

config.webpack = {
  entry: {
    'index': path.resolve(config.src, 'index'),
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(config.dest)
  },
  devtool: env.development() ? "source-map" : "",
  module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				include: path.resolve(config.src),
				query: {
					cacheDirectory: true,
					presets: ['es2015', 'react', 'stage-3'],
          plugins: ['transform-runtime', 'transform-class-properties']
				}
			},
			{
				test: /\.scss$/,
        loader: 'style-loader!css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!sass-loader?sourceMap'
        // loader: 'style-loader!css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!sass-loader?sourceMap'
			},
      { 
        test: /\.css$/, 
        loader: 'style-loader!css-loader' 
        }, 
      { 
        test: /\.(png|jpg)$/, 
        loader: 'url-loader?limit=8192' // inline base64 URLs for <=8k images, direct URLs for the rest
      }, 
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, 
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      { 
        test: /\.md$/, 
        loader: path.resolve(config.publicRoot, 'src', 'lib', 'markdown-loader.js') 
      },
    ]
  },
  plugins: env.production() ? [
		htmlWebpackPlugin,
    extractTextPlugin,
    commonsChunkPlugin,
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: { 
        // warnings: true,
        warnings: false, // Suppress uglification warnings
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        drop_console: true,
        pure_getters: true,
        sequences: true,
        booleans: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false
      }
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    }),
    bundleAnalyzerPlugin,
		definePlugin,
    occurenceOrderPlugin,
    new webpack.optimize.AggressiveMergingPlugin()
  ] : [
    bundleAnalyzerPlugin,
    commonsChunkPlugin,
    extractTextPlugin,
		htmlWebpackPlugin,
    occurenceOrderPlugin,
    new webpack.optimize.AggressiveMergingPlugin()
  ],
  bail: env.production(),
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'],
  }
};

gulp.task('webpack', ['webpack:clean'], (done) => {
  return gulp.src(config.src)
    .pipe(gulpWebpack(config.webpack, webpack))
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(config.dest))
    .pipe(notify());
});

gulp.task('webpack:clean', (done) => {
  return del([config.dest + '/*.js'], done);
});
