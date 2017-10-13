"use strict";

const gulp = require('gulp');
const gutil = require('gulp-util');
const notify = require('gulp-notify');
const env = require('gulp-environments');
const del = require('del');
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const webpack = require('webpack');
const gulpWebpack = require('webpack-stream');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require("compression-webpack-plugin");
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const config = require('config/gulp.js');

gulp.task('webpack', ['webpack:clean'], (done) => {
  console.log('Running webpack task');

  const gitCommit = childProcess.execSync('git rev-parse HEAD').toString().trim();

  const extractTextPlugin = new ExtractTextPlugin('[name].css');
  const occurenceOrderPlugin = new webpack.optimize.OccurrenceOrderPlugin()

  const commonsChunkPlugin = new CommonsChunkPlugin({
    names: ['fonts-loader'],
    minChunks: Infinity,
  });

  const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerHost: process.env.BUNDLE_ANALYZER_HOST,
    analyzerPort: process.env.BUNDLE_ANALYZER_PORT,
  });

  const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: HtmlWebpackTemplate,
    title: 'UpRise App',
    appMountId: 'app', // Generate #app where to mount
    mobile: true, // Scale page on mobile
    inject: false // html-webpack-template requires this to work
  })

  let currentProgress = 0;
  const progressPlugin = new ProgressPlugin((percentage, msg) => {
    percentage = Math.floor(percentage * 100);
    if (percentage !== currentProgress) {
      currentProgress = percentage;
      const logline = currentProgress + '% ' + msg;
      gutil.log('webpack', logline);
    }
  });

  const definePlugin = new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': env.development() ? JSON.stringify('development') : JSON.stringify('production'),
      'SERVER_BASE_URL': '"' + process.env.SERVER_BASE_URL + '"',
      'CLIENT_BASE_URL': '"' + process.env.CLIENT_BASE_URL + '"',
      'AWS_S3_REGION': '"' + process.env.AWS_S3_REGION + '"',
      'AWS_S3_BUCKET_NAME': '"' + process.env.AWS_S3_BUCKET_NAME + '"',
      'AWS_S3_ENDPOINT': '"' + process.env.AWS_S3_ENDPOINT + '"',
      'SENTRY_PUBLIC_DSN': '"' + process.env.SENTRY_PUBLIC_DSN + '"',
      'GOOGLE_UA_ID': '"' + process.env.GOOGLE_UA_ID + '"',
      'GIT_COMMIT': '"' + gitCommit + '"',
    }
  });

  const swPrecachePlugin = new SWPrecacheWebpackPlugin({
    verbose: true,
    debug: true,
    cacheId: 'sw-precache-uprise-app',
    filename: 'service-worker.js',
    minify: env.production(),
    // // navigateFallback: PUBLIC_PATH + 'index.html',
    // staticFileGlobsIgnorePatterns: [/\.map$/],
  });

  const pwaManifestPlugin =  new WebpackPwaManifest({
    name: 'UpRise Campaigns',
    short_name: 'UpRise',
    description: 'Your Home for Progressive Volunteering',
    background_color: '#0e4053',
    theme_color: '#0e4053',
    icons: [
      {
        src: path.resolve(config.src, 'img/uprise-logo-icon.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      },
    ]
  });

  const faviconPlugin = new FaviconsWebpackPlugin(path.resolve(config.src, 'img/uprise-logo-icon.png'));

  config.webpack = {
    entry: {
      'index': ['babel-polyfill', path.resolve(config.src, 'index')]
    },
    output: {
      filename: '[name]-[hash].js',
      publicPath: process.env.CLIENT_BASE_URL,
      path: config.dest
    },
    devtool: env.development() ? "eval-cheap-module-source-map" : "",
    watch: env.development(),
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          options: {
            fix: false
          },
          include: [
            path.resolve(config.publicRoot),
          ]
        },
        {
          test: /\.m?jsx?$/,
          loader: 'babel-loader',
          include: [
            path.resolve(config.publicRoot),
            path.resolve(config.nodeModules, 'camelcase'),
          ],
          query: {
            cacheDirectory: true,
            presets: ['es2015', 'react', 'stage-3'],
            plugins: ['transform-runtime', 'transform-class-properties']
          }
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader'
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
    externals: {
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': true
    },
    plugins: env.production() ? [
      htmlWebpackPlugin,
      extractTextPlugin,
      commonsChunkPlugin,

      new webpack.optimize.UglifyJsPlugin({
        mangle: true,
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
      definePlugin,
      occurenceOrderPlugin,
      new webpack.optimize.AggressiveMergingPlugin(),
      swPrecachePlugin,
      progressPlugin,
      pwaManifestPlugin,
      faviconPlugin,
    ] : [
      // bundleAnalyzerPlugin,
      definePlugin,
      commonsChunkPlugin,
      progressPlugin,
      extractTextPlugin,
      htmlWebpackPlugin,
      occurenceOrderPlugin,
      swPrecachePlugin,
      new webpack.optimize.AggressiveMergingPlugin(),
      pwaManifestPlugin,
      faviconPlugin,
    ],

    bail: env.production(),
    resolve: {
      extensions: ['*', '.js', '.jsx', '.json'],
    },
    node: {
      fs: 'empty'
    }
  };

  return gulp.src(config.src)
    .pipe(gulpWebpack(config.webpack, webpack, (err, stats) => {
      err && console.error(err);

      setImmediate(() => {
        // write the in-memory service-worker.js to disk
        const abspath = path.resolve(config.dest, 'service-worker.js')
        const content = stats.compilation.compiler.outputFileSystem.readFileSync(abspath)
        fs.writeFileSync(abspath, content)

        gutil.log(stats.toString({
          colors: gutil.colors.supportsColor,
        }));
      });
    }))
    .on("error", notify.onError("Error: <%= error.message %>"))
    .pipe(gulp.dest(config.dest))
    .pipe(notify());
});

gulp.task('webpack:clean', (done) => {
  return del([
    config.dest + '/*.js',
    config.dest + '/*.map',
    config.dest + '/*.gz',
  ], done);
});
