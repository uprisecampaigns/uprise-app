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
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessKeySecret: process.env.AWS_ACCESS_KEY_SECRET,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_S3_REGION,
    expirationTime: 300
  },
  postmark: {
    serverKey: process.env.POSTMARK_SECRET_KEY,
    validRecipient: (email) => {
      return (email.split('@').pop() === 'uprise.org'); // only send to @uprise.org email accounts for now
    },
    from: 'notifications@uprise.org'
  },
  urls: {
    api: process.env.SERVER_BASE_URL,
    client: process.env.CLIENT_BASE_URL
  },
  paths: {
    base: path.resolve(__dirname, '..')
  }
}
