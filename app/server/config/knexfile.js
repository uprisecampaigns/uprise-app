// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      timezone: 'America/Los_Angeles',
    },
    migrations: {
      tableName: 'migrations',
    },
    pool: {
      afterCreate: (connection, callback) => {
        connection.query('SET timezone to \'' + process.env.TZ + '\'', (err) => {
          callback(err, connection);
        });
      }
    }
  },

  staging: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      timezone: 'America/Los_Angeles',
    },
    migrations: {
      tableName: 'migrations',
    },
    pool: {
      afterCreate: (connection, callback) => {
        connection.query('SET timezone to \'' + process.env.TZ + '\'', (err) => {
          callback(err, connection);
        });
      },
      min: 2,
      max: 10,
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      timezone: 'America/Los_Angeles',
    },
    migrations: {
      tableName: 'migrations',
    },
    pool: {
      afterCreate: (connection, callback) => {
        connection.query('SET timezone to \'' + process.env.TZ + '\'', (err) => {
          callback(err, connection);
        });
      },
      min: 2,
      max: 10,
    },
  },
};
