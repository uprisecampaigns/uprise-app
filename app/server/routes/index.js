const path = require('path');
const express = require('express');
const router = express.Router();

module.exports = (app, passport) => {
  console.log('setting authentication routes...');
  // set authentication routes
  require('./authentication.js')(app, passport);

  require('./graphql.js')(app);

  require('./calendar-links.js')(app);

  // set other routes
  app.use('/', router);
};
