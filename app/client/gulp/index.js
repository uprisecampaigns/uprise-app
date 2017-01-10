"use strict";

const fs = require('fs');
const path = require('path');

const config = require('./config');

const onlyScripts = function(name) {
  return /(\.(js)$)/i.test(path.extname(name));
};

const tasks = fs.readdirSync(path.resolve(config.gulpDir, 'tasks')).filter(onlyScripts);

tasks.forEach((task) => {
	require('./tasks/' + task);
});
