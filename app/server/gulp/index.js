"use strict";

const fs = require('fs');
const path = require('path');

const onlyScripts = function(name) {
  return /(\.(js)$)/i.test(path.extname(name));
};

const tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts);

tasks.forEach((task) => {
	require('./tasks/' + task);
});
