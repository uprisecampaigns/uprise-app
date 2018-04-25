const fs = require('fs');
const path = require('path');
const config = require('../config/gulp.js');

const onlyScripts = name => /(\.(js)$)/i.test(path.extname(name));

const tasks = fs.readdirSync(path.resolve(config.serverRoot, 'gulp', 'tasks')).filter(onlyScripts);

tasks.forEach((task) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  require(`./tasks/${task}`);
});
