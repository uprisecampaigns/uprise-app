const path = require('path');
const express = require('express');
const router = express.Router();

// Rest API
// TODO: todos route uses sockets
// require(path.resolve(__dirname, 'todos'))(router);
require(path.resolve(__dirname, 'users'))(router);

module.exports = (app, passport) => {
  console.log('setting authentication routes...');
	// set authentication routes
	require('./authentication.js')(app, passport);

	require('./graphql.js')(app);

	// set other routes
	app.use('/', router);
};
