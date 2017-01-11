const path = require('path');

module.exports = {
  sessionOptions: {
    secret: 'somesecretkeythatweshouldgenerateandstoresomewhere', //TODO make real secret
    saveUninitialized: true, // save new sessions
    resave: false, // do not automatically write to the session store
    cookie: { 
      httpOnly: true, 
      maxAge: 2419200000 
    } // TODO set secure to true when https is used
  },
  postmark: {
    serverKey: process.env.POSTMARK_SECRET_KEY,
    validRecipient: email => (email === 'bittmanmax@gmail.com'),
    from: 'max@uprise.org'
  },
  api: {
    baseUrl: process.env.SERVER_BASE_URL,
    basePath: path.resolve(__dirname, '..')
  }
}
