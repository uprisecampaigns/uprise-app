
const similarityThreshold = process.env.DATABASE_SIMILARITY_THRESHOLD;
const wordSimilarityThreshold = process.env.DATABASE_WORD_SIMILARITY_THRESHOLD;
const tagSimilarityThreshold = process.env.DATABASE_TAG_SIMILARITY_THRESHOLD;

const afterCreate = (connection, callback) => {
  connection.query(`SET timezone to '${process.env.TZ}';`, (err) => {
    if (err) {
      callback(err, connection);
    } else {
      // For some reason you have to call the similarity() function
      // first before you can set pg_trgm.similarity_threshold
      // eslint-disable-next-line max-len
      connection.query(`select similarity('a', 'a'); SET pg_trgm.similarity_threshold='${similarityThreshold}'; SET pg_trgm.word_similarity_threshold='${similarityThreshold}'`, (similarityThresholdQueryErr) => {
        callback(similarityThresholdQueryErr, connection);
      });
    }
  });
};

module.exports = {

  similarityThreshold,
  wordSimilarityThreshold,
  tagSimilarityThreshold,

  development: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      timezone: process.env.TZ,
    },
    migrations: {
      tableName: 'migrations',
    },
    pool: {
      afterCreate,
    },
  },

  staging: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      timezone: process.env.TZ,
    },
    migrations: {
      tableName: 'migrations',
    },
    pool: {
      afterCreate,
      min: 2,
      max: 10,
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      timezone: process.env.TZ,
    },
    migrations: {
      tableName: 'migrations',
    },
    pool: {
      afterCreate,
      min: 2,
      max: 10,
    },
  },
};
