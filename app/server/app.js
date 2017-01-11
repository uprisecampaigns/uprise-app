const express = require('express');
const session  = require('express-session');
const passport = require('passport');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const LocalStrategy = require('passport-local').Strategy;

const config = require('./config/config.js');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Sessions/PassportJS/Authentication
require('./config/passport.js')(passport);

const sessionOptions = config.sessionOptions;
// sessionOptions.store = new RedisStore(); // TODO set up redis store
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());


// set routes
require('./routes/index')(app, passport);

// RANDOM TESTING
app.get('/api/testing', 
  function (req, res) {
    console.log(req);
    return res.json({success: 'you betcha'});
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;
