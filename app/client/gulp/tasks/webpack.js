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

const config = require('../config');

const extractTextPlugin = new ExtractTextPlugin('[name].css');

const commonsChunkPlugin = new CommonsChunkPlugin({
  names: ['bootstrap-loader'],
  minChunks: Infinity,
});

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
    'bootstrap-loader': path.resolve(config.src, 'bootstrap-loader'),
  },
  output: {
    filename: '[name].js',
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
					presets: ['es2015', 'react'],
          plugins: ['transform-class-properties']
				}
			},
			{
				test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
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
      }
    ]
  },
  plugins: env.production() ? [
		htmlWebpackPlugin,
    extractTextPlugin,
    commonsChunkPlugin,
    new webpack.optimize.UglifyJsPlugin({
      compress: { 
        warnings: true,
      }
    }),
		definePlugin,
    new webpack.optimize.AggressiveMergingPlugin()
  ] : [
    commonsChunkPlugin,
    extractTextPlugin,
		htmlWebpackPlugin,
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
