// TODO create and use utility fuction that converts req.user to userObject
const authenticationMiddleware = require('../middlewares/authentication.js');
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

  app.post('/api/checkSession', (req, res) => {
    const isLoggedIn = req.isAuthenticated();
    if (isLoggedIn) {
      return res.json({	
        isLoggedIn: isLoggedIn,
        userObject: {	
          displayName: req.user.display_name, 
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
