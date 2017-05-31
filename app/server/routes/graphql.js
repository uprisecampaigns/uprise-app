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


module.exports = (app) => {

  const root = Object.assign({}, userFuncs, campaignFuncs, actionFuncs, miscFuncs);

  app.use('/api/graphql', graphqlExpress(req => ({
    schema: schema,
    rootValue: root,
    context: { user: req.user },
    debug: (app.get('env') === 'development'),
    formatError: (error) => {
      if (error.path || error.name !== 'GraphQLError') {
        console.error(error);
        Raven.captureException(error,
          Raven.parsers.parseRequest(req, {
            tags: { graphql: 'exec_error' },
            extra: {
              source: error.source && error.source.body,
              positions: error.positions,
              path: error.path,
            },
          })
        );
      } else {
        console.error(error.message);
        Raven.captureMessage(`GraphQLWrongQuery: ${error.message}`,
          Raven.parsers.parseRequest(req, {
            tags: { graphql: 'wrong_query' },
            extra: {
              source: error.source && error.source.body,
              positions: error.positions,
            },
          })
        );
      }
      return {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack.split('\n') : null,
      };
    }
  })));

  app.use('/api/graphiql', authenticationMiddleware.isLoggedIn, graphiqlExpress({
    endpointURL: '/api/graphql'
  }));

}
