const debug = require('debug')('app');
const childProcess = require('child_process');

// TODO create and use utility fuction that converts req.user to userObject
const authenticationMiddleware = require('middlewares/authentication.js');
const User = require('models/User.js');

const gitCommit = childProcess.execSync('git rev-parse HEAD').toString().trim();

// Note: if user is already signed in, this will overwrite the previous session
// on the client side

const addAuthRoute = (app, passport, routePath, strategy) => {
  app.post(routePath, (req, res, next) => (
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.json(info);
      }

      return req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.json(user);
      });
    })(req, res, next)
  ));
};

module.exports = (app, passport) => {
  addAuthRoute(app, passport, '/api/signup', 'local-signup');

  addAuthRoute(app, passport, '/api/login', 'local-login');

  app.post('/api/checkEmailAvailability', async (req, res) => {
    try {
      const { email } = req.body;
      const result = await User.findOne({ args: { email } });

      let available = true;

      if (result) {
        available = false;
      }

      return res.json({
        available,
      });
    } catch (err) {
      return res.json({
        error: err.message,
      });
    }
  });

  app.post('/api/logout', authenticationMiddleware.isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    return res.json('logged out');
  });

  app.get('/api/email-verification/:token', async (req, res, next) => {
    const { token } = req.params;

    try {
      await User.verifyEmail({ token });
      return res.redirect('/');
    } catch (err) {
      return next(err);
    }
  });

  app.post('/api/reset-password', async (req, res, next) => {
    const { email } = req.body;

    try {
      await User.resetPassword(email, req);
      return res.json('Password reset successfully. Please check your email for further info.');
    } catch (err) {
      return res.json({
        error: err.message,
      });
    }
  });

  app.get('/api/use-password-reset/:code', async (req, res, next) => {
    const { code } = req.params;

    try {
      const user = await User.usePasswordResetCode(code);
      return req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/settings/privacy-security');
      });
    } catch (err) {
      return next(err);
    }
  });

  app.post('/api/change-password', authenticationMiddleware.isLoggedIn, async (req, res, next) => {
    const { id } = req.user;
    const { newPassword, oldPassword } = req.body;

    try {
      await User.changePassword(id, newPassword, oldPassword);
      return res.json('Password changed successfully.');
    } catch (err) {
      return res.json({
        error: err.message,
      });
    }
  });

  app.post('/api/checkSession', (req, res) => {
    const isLoggedIn = req.isAuthenticated();
    if (isLoggedIn) {
      debug({
        name: `${req.user.first_name} ${req.user.last_name}`,
        email: req.user.email,
      });

      return res.json({
        isLoggedIn,
        userObject: {
          id: req.user.id,
          email: req.user.email,
          passwordBeingReset: req.user.password_being_reset,
        },
        gitCommit,
      });
    }
    return res.json({
      isLoggedIn,
    });
  });
};
