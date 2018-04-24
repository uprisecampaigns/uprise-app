let fs = require('fs');
let path = require('path');

let clientLinks = [
  'config',
  'src/actions',
  'src/components',
  'src/content',
  'src/img',
  'src/lib',
  'src/reducers',
  'src/routes',
  'src/scenes',
  'src/schemas',
  'src/store',
  'src/styles',
];

let serverLinks = [
  'config',
  'src/lib',
  'src/middlewares',
  'src/models',
  'src/routes',
];

let createLinks = base => link => {
  try {
    let src = path.resolve(base, link);
    let dst = path.resolve(base, 'node_modules', path.basename(link));
    fs.symlinkSync(src, dst, 'junction');
  } catch(e) {
    console.warn(`Did not create symlink at location ${link}: ${e}`);
  }
};

clientLinks.forEach(createLinks('client'));
serverLinks.forEach(createLinks('server'));
