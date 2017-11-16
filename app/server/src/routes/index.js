const path = require('path');
const express = require('express');

const router = express.Router();

module.exports = (app, passport) => {
  // set authentication routes
  require('./authentication.js')(app, passport);

  require('./graphql.js')(app);

  require('./rss.js')(app);

  require('./calendar-links.js')(app);

  // set other routes
  app.use('/', router);
};
