module.exports = {

  isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.json({ error: 'Not signed in' });
  },

  isLoggedOut(req, res, next) {
    if (!req.isAuthenticated()) return next();
    res.json({ error: 'Already signed in' });
  },

};
