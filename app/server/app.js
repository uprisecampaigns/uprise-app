const express = require('express');
const session  = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Raven = require('raven');

const LocalStrategy = require('passport-local').Strategy;

const config = require('config/config.js');

const app = express();


Raven.config(config.sentry.dsn, {
  parseUser: ['id', 'email', 'first_name', 'last_name', 'zipcode', 'phone_number']
}).install();

app.use(Raven.requestHandler());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// proxy behind nginx
// TODO: More restrictive ip list?
app.set('trust proxy', true);

app.use(logger((tokens, req, res) => {
  const logArray = [
    tokens['remote-addr'](req), '-',
    req.user && req.user.first_name + ' ' + req.user.last_name + ' - ' + req.user.email,
    tokens.date(req, res, 'clf'),
    tokens.method(req, res),
    tokens.url(req, res),
    'HTTP/:' + tokens['http-version'](req),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.referrer(req, res),
    tokens['user-agent'](req)
  ];

  // Only log the body of graphql requests
  // and never log anything that has the string password in it
  // TODO: better long term fix for not logging sensitive info
  if (req.method.toLowerCase() === 'post' && req.baseUrl === '/api/graphql' &&
      !JSON.stringify(req.body).toLowerCase().includes('password')) {
    logArray.push(' Graphql body: ' + JSON.stringify(req.body));
  }

  return logArray.join(' ');
}));

app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Sessions/PassportJS/Authentication
require('./passport.js')(passport);

const sessionOptions = config.sessionOptions;

const redisClient = redis.createClient(config.redis);

redisClient.on('error', function(err) {
  console.error(err);
});

sessionOptions.store = new RedisStore({
  client: redisClient
}); 

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// set routes
require('routes/index')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

app.use(Raven.errorHandler());

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: {}
    });
});
module.exports = app;
