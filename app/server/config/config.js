const path = require('path');

module.exports = {
  sessionOptions: {
    secret: process.env.SESSION_SECRET_KEY, 
    saveUninitialized: true, // save new sessions
    resave: false, // do not automatically write to the session store
    cookie: { 
      httpOnly: true, 
      maxAge: 2419200000 
    } // TODO set secure to true when https is used
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  postmark: {
    serverKey: process.env.POSTMARK_SECRET_KEY,
    validRecipient: (email) => {
      return (email.split('@').pop() === 'uprise.org'); // only send to @uprise.org email accounts for now
    },
    from: 'max@uprise.org'
  },
  api: {
    baseUrl: process.env.SERVER_BASE_URL,
    basePath: path.resolve(__dirname, '..')
  }
}
