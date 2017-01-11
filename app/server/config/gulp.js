"use strict";

const path = require('path');
const appRoot = path.resolve(__dirname, '..', '..');
const publicRoot = path.resolve(appRoot, 'client');
const serverRoot = path.resolve(appRoot, 'server');

module.exports = {
  appRoot: appRoot,
  serverRoot: serverRoot,
  publicRoot: publicRoot,
};
