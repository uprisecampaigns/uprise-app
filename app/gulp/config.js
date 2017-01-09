"use strict";

const path = require('path');
const appRoot = path.resolve(__dirname, '..');
const publicRoot = path.resolve(__dirname, '..', 'public');
module.exports = {
  appRoot: appRoot,
  publicRoot: publicRoot,
  dest: path.resolve(publicRoot, 'builds'),
  src: path.resolve(publicRoot, 'src')
};
