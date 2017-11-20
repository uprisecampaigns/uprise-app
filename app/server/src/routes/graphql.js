const graphqlServer = require('apollo-server-express');
const bodyParser = require('body-parser');
const Raven = require('raven');

const { graphqlExpress, graphiqlExpress } = graphqlServer;

const schema = require('../graphql/schema.js');
const authenticationMiddleware = require('middlewares/authentication.js');

const ravenCallback = require('lib/ravenCallback.js');


module.exports = (app) => {
  app.use('/api/graphql', bodyParser.json(), graphqlExpress(req => ({
    schema,
    context: { user: req.user },
    debug: (app.get('env') === 'development'),
    formatError: (error) => {
      Raven.setContext({ req });
      if (error.path || error.name !== 'GraphQLError') {
        console.error(error);
        Raven.mergeContext({
          tags: { graphql: 'exec_error' },
          extra: {
            source: error.source && error.source.body,
            positions: error.positions,
            path: error.path,
          },
        });
        Raven.captureException(error, ravenCallback);
      } else {
        console.error(error.message);
        Raven.mergeContext({
          tags: { graphql: 'query_error' },
          extra: {
            source: error.source && error.source.body,
            positions: error.positions,
          },
        });
        Raven.captureMessage(`GraphQLQueryError: ${error.message}`, ravenCallback);
      }
      return {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack.split('\n') : null,
      };
    },
  })));

  app.use('/api/graphiql', authenticationMiddleware.isLoggedIn, graphiqlExpress({
    endpointURL: '/api/graphql',
  }));
};
