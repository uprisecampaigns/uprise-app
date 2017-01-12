// TODO design what to store in the session object other than just user.id
// TODO see what happens if someone sends a request with an invalid session but actual id
//        - I assume the session store just rejects it or wipes it or something....
// TODO create utility function that takes row and converts to userObject for client

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const postmark = require('postmark');
const ejs = require('ejs');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig.development);
const config = require('config/config.js');
const User = require('models/User.js');

const emailClient = postmark(config.postmark.serverKey);

const sendVerificationEmail = (user) => {
  return new Promise( (resolve, reject) => {

    if (config.postmark.validRecipient(user.email)) {

      const sendEmail = (textBody, htmlBody) => {

        emailClient.sendEmail({
          'From': config.postmark.from,
          'To': user.email,
          'Subject': 'Confirm your email address', 
          'TextBody': textBody,
          'HtmlBody': htmlBody
        }, (err, result) => {
          if (err) {
            console.error('Unable to send via postmark: ' + err.message);
            reject(err);
          } else {
            console.info('Sent to postmark for delivery: ' + result);
            resolve(result);
          }
        });
      };

      const options = {
        verifyURL: config.api.baseUrl + '/email-verification/' + user.verificationToken
      };

      ejs.renderFile(config.api.basePath + '/views/verification-email-text.ejs', options, function (err, textBody) {
        if (err) {
          reject(err);
        } else {
          ejs.renderFile(config.api.basePath + '/views/verification-email-html.ejs', options, function (err, htmlBody) {
            if (err) {
              reject(err);
            } else {
              sendEmail(textBody, htmlBody);
            }
          });
        }
      });
    } else {
      console.info(user.email + ' does not pass validRecipient test so not sending email');
      resolve();
    }
  });
};

module.exports = (passport) => {


  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser( (user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(async (id, done) => {
    try {
      const rows = await db.select().from('users').where('id', id);
      done(null, rows[0]);
    } catch (err) {
      done(err);
    }
  });

  // =========================================================================
  // LOCAL SIGNUP ============================================================
  // =========================================================================

  passport.use(
    'local-signup',
    new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    async (req, email, password, done) => {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists

      try {
        const rows = await db.select().from('users').where('email', email);

        if (rows.length) {
          return done(null, false, { error: 'That email is already being used.' });
        } else {
          const salt = bcrypt.genSaltSync(10);
          const passwordHash = bcrypt.hashSync(password, salt);
          const userInfo = {
            email: email,
            password_hash: passwordHash
          };

          const user = await User.create(userInfo);
          await sendVerificationEmail(user);

          return done(null, {
            id: user.id,
            email: user.email
          });
        }
      } catch (err) {
        return done(err);
      }
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


