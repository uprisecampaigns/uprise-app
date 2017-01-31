const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const graphqlServer = require('graphql-server-express');
const graphqlExpress = graphqlServer.graphqlExpress;
const graphiqlExpress = graphqlServer.graphiqlExpress;

const schema = require('../schema');
const authenticationMiddleware = require('middlewares/authentication.js');

const Opportunity = require('models/Opportunity');
const User = require('models/User');

module.exports = (app) => {

  const root = {
    me: async (data, context) => {

      const user = await User.findOne({
        id: context.user.id
      });

      return {
        email: user.email,
        zip: user.zip,
      }
    },

    opportunity: async (data, context) => {

      const opportunity = await Opportunity.findOne({
        id: data.id
      });

      const user = await User.findOne({
        id: opportunity.owner_id
      });

      return {
        title: opportunity.title,
        userEmail: user.email
      }
    },

    createOpportunity: async (data, context) => {
      const opportunity = await Opportunity.create({
        ownerId: data.userId,
        title: data.title
      });

      const user = await User.findOne({
        id: data.userId
      });

      return {
        title: opportunity.title,
        userEmail: user.email
      }
    }
  };

  app.use('/api/graphql', authenticationMiddleware.isLoggedIn, graphqlExpress(req => ({
    schema: schema,
    rootValue: root,
    context: { user: req.user },
    debug: (app.get('env') === 'development')
  })));

  app.use('/api/graphiql', authenticationMiddleware.isLoggedIn, graphiqlExpress({
    endpointURL: '/api/graphql'
  }));

}
