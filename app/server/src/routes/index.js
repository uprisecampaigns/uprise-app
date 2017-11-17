const express = require('express');

const graphqlRoutes = require('./graphql.js');
const authenticationRoutes = require('./authentication.js');
const rssRoutes = require('./rss.js');
const calendarLinkRoutes = require('./calendar-links.js');

const router = express.Router();

module.exports = (app, passport) => {
  authenticationRoutes(app, passport);

  graphqlRoutes(app);

  rssRoutes(app);

  calendarLinkRoutes(app);

  // set other routes
  app.use('/', router);
};
