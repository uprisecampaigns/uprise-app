// TODO design what to store in the session object other than just user.id
// TODO see what happens if someone sends a request with an invalid session but actual id
//        - I assume the session store just rejects it or wipes it or something....
// TODO create utility function that takes row and converts to userObject for client

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const postmark = require('postmark');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);
const config = require('config/config.js');
const User = require('models/User.js');

const emailClient = postmark(config.postmark.serverKey);

module.exports = function(passport) {


  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    db.select().from('users').where('id', id)
      .then( (rows) => {
        done(null, rows[0]);
      })
      .catch( (err) => {
        done(err);
      });
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================

  console.log('passport.use local-signup');
  passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    (req, email, password, done) => {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      db.select().from('users').where('email', email)
        .then( (rows) => {
          if (rows.length) {
            return done(null, false, { error: 'That email is already being used.' });
          }else {

            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, salt);
            const userInfo = {
              email: email,
              password_hash: passwordHash
            };

            User.create(userInfo)
              .then( (user) => {

                if (config.postmark.validRecipient(email)) {
                  console.log('sending email');
                  emailClient.sendEmail({
                    'From': config.postmark.from,
                    'To': email,
                    'Subject': 'Testing', 
                    'TextBody': 'Verification token: ' + user.verificationToken
                  }, (err, result) => {
                    if (err) {
                      console.error('Unable to send via postmark: ' + err.message);
                    } else {
                      console.info('Sent to postmark for delivery: ' + result);
                    }
                  });
                }
                return done(null, user);
              })
              .catch( (err) => {
                return done(err);
              })
          }
        })
        .catch( (err) => {
          return done(err);
        });
    })
  );

  // =========================================================================
  // LOCAL LOGIN =============================================================
  // =========================================================================

  passport.use( 
    'local-login',
    new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      db.select().from('users').where('email', email)
        .then( (rows) => {
          if (!rows.length) {
            console.log("no user found...");
            return done(null, false, {error: 'Email not found.'});
          }

          console.log(rows[0]);

          // if the user is found but the password is wrong
          if (!bcrypt.compareSync( password, rows[0].password_hash)){
            return done(null, false, {error: 'Incorrect password.'});
          }

          var userObject  = { 
            id: rows[0].id, 
            email: rows[0].email, 
            displayName: rows[0].display_name
          };
          return done(null, userObject);  
        })
        .catch( (err) => {
          return done(err);
        })
    })
  );
};


