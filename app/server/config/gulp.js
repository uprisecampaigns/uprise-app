
const path = require('path');

const gitRoot = path.resolve(__dirname, '..', '..', '..', '.git');
const appRoot = path.resolve(__dirname, '..', '..');
const publicRoot = path.resolve(appRoot, 'client');
const serverRoot = path.resolve(appRoot, 'server');
const serverSrc = path.resolve(serverRoot, 'src');

module.exports = {
  gitWatchDir: path.resolve(gitRoot, 'refs', 'heads'),
  appRoot,
  serverRoot,
  publicRoot,
  serverSrc,
};
