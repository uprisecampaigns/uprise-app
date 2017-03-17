"use strict";

const path = require('path');
const appRoot = path.resolve(__dirname, '..', '..');
const publicRoot = path.resolve(appRoot, 'client');
const serverRoot = path.resolve(appRoot, 'server');

module.exports = {
  appRoot: appRoot,
  gulpfile: path.resolve(publicRoot, 'gulpfile.js'),
  publicRoot: publicRoot,
  serverRoot: serverRoot,
  gulpDir: path.resolve(publicRoot, 'gulp'),
  nodeModules: path.resolve(appRoot, 'node_modules'),
  dest: path.resolve(publicRoot, 'builds'),
  src: path.resolve(publicRoot, 'src')
};
