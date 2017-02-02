// TODO create and use utility fuction that converts req.user to userObject
const authenticationMiddleware = require('middlewares/authentication.js');
const User = require('models/User.js');

/**
	*	Note: if user is already signed in, this will overwrite the previous session
	*				on the client side
	*/	

const addAuthRoute = (app, passport, routePath, strategy) => {
  app.post(routePath, (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) { 
        return next(err); 
      }
      if (!user) { 
        return res.json(info); 
      }
      if (user) {
        req.logIn(user, (err) => {
          if (err) { 
            return next(err); 
          }
          return res.json(user); 
        });
      }
    })(req, res, next);
  });
}

module.exports = (app, passport) => {

  addAuthRoute(app, passport, "/api/signup", "local-signup");

  addAuthRoute(app, passport, "/api/login", "local-login");

  app.post('/api/checkEmailAvailability', async (req, res) => {
    try {
      const email = req.body.email;
      const result = await User.findOne('email', email);
      let available = true;

      if (result) {
        available = false;
      }

      res.json({
        available: available
      });

    } catch(err) {
      return res.json({
        error: err.message
      });
    }
  });

  app.post('/api/logout', authenticationMiddleware.isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    return res.json('logged out');
  });

  app.get('/api/email-verification/:token', authenticationMiddleware.isLoggedIn, async (req, res, next) => {
    const token = req.params.token;

    try {
      const result = await User.verifyEmail({token: token, userId: req.user.id});
      res.redirect('/');
    } catch(err) {
      next(err);
    }
  });

  app.post('/api/reset-password', async (req, res, next) => {
    const email = req.body.email;

    try {
      const result = await User.resetPassword(email, req);
      return res.json('password reset successfully');
    } catch(err) {
      return res.json({
        error: err.message
      });
    }
  });

  app.get('/api/use-password-reset/:code', async (req, res, next) => {
    const code = req.params.code;

    try {
      const user = await User.usePasswordResetCode(code);
      req.logIn(user, (err) => {
        if (err) { 
          return next(err); 
        }
        res.redirect('/settings/change-password');
      });
    } catch(err) {
      next(err);
    }
  });

  app.post('/api/change-password', authenticationMiddleware.isLoggedIn, async (req, res, next) => {
    const id = req.user.id;
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    try {
      const result = await User.changePassword(id, newPassword, oldPassword);
      return res.json('password changed successfully');
    } catch(err) {
      return res.json({
        error: err.message
      });
    }
  });

  app.post('/api/checkSession', (req, res) => {
    const isLoggedIn = req.isAuthenticated();
    if (isLoggedIn) {
      return res.json({	
        isLoggedIn: isLoggedIn,
        userObject: {	
          id:req.user.id, 
          email:req.user.email
        }
      });
    }
    return res.json({
      isLoggedIn: isLoggedIn
    });
  });
};
