
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const knex = require('knex');
const knexConfig = require('config/knexfile.js');
const db = knex(knexConfig[process.env.NODE_ENV]);
const config = require('config/config.js');
const User = require('models/User.js');
const sendEmail = require('lib/sendEmail.js');


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

          const zipcode = req.body.zipcode;
          const firstName = req.body.firstName;
          const lastName = req.body.lastName;

          const userInfo = {
            email: email,
            zipcode: zipcode,
            password_hash: passwordHash,
            first_name: firstName,
            last_name: lastName
          };

          const user = await User.create(userInfo);

          await User.sendVerificationEmail(user);

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
      db.select().from('users').where('email', email).first()
        .then( (user) => {
          if (!user) {
            console.log("no user found...");
            return done(null, false, {error: 'Email not found.'});
          }

          // if the user is found but the password is wrong
          if (!bcrypt.compareSync( password, user.password_hash)){
            return done(null, false, {error: 'Incorrect password.'});
          }

          // if the user has used a password reset code but hasn't changed password yet
          if (user.password_being_reset){
            return done(null, false, {error: 'Currently resetting password.'});
          }

          var userObject  = { 
            id: user.id, 
            email: user.email, 
            displayName: user.display_name
          };
          return done(null, userObject);  
        })
        .catch( (err) => {
          return done(err);
        })
    })
  );
};


