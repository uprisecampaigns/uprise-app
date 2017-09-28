const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const graphqlServer = require('graphql-server-express');
const Raven = require('raven');

const graphqlExpress = graphqlServer.graphqlExpress;
const graphiqlExpress = graphqlServer.graphiqlExpress;

const schema = require('../schema');
const authenticationMiddleware = require('middlewares/authentication.js');

const userFuncs = require('./graphql-functions/user.js');
const campaignFuncs = require('./graphql-functions/campaign.js');
const actionFuncs = require('./graphql-functions/action.js');
const miscFuncs = require('./graphql-functions/misc.js');

const ravenCallback = require('lib/ravenCallback.js');


module.exports = (app) => {
  const root = Object.assign({}, userFuncs, campaignFuncs, actionFuncs, miscFuncs);

  app.use('/api/graphql', graphqlExpress(req => ({
    schema,
    rootValue: root,
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
