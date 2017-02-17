const graphqlHTTP = require('express-graphql');
const assert = require('assert');
const bodyParser = require('body-parser');
const graphqlServer = require('graphql-server-express');
const graphqlExpress = graphqlServer.graphqlExpress;
const graphiqlExpress = graphqlServer.graphiqlExpress;

const schema = require('../schema');
const authenticationMiddleware = require('middlewares/authentication.js');

const Opportunity = require('models/Opportunity');
const Campaign = require('models/Campaign');
const User = require('models/User');

module.exports = (app) => {

  const root = {
    me: async (data, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const user = await User.findOne({
        id: context.user.id
      });

      return {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        zip: user.zip,
      }
    },

    emailAvailable: async (data, context) => {
      const result = await User.findOne('email', data.email);
      let available = true;

      if (result) {
        available = false;
      }

      return available;
    },

    opportunities: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const opportunities = await Opportunity.search(data.search);
      console.log(opportunities);
      return opportunities;
    },

    activities: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const activities = await Opportunity.listActivities(data.search);
      console.log(activities);
      return activities;
    },

    types: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const types = await Campaign.listTypes(data.search);
      console.log(types);
      return types;
    },

    createOpportunity: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

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

  app.use('/api/graphql', graphqlExpress(req => ({
    schema: schema,
    rootValue: root,
    context: { user: req.user },
    debug: (app.get('env') === 'development')
  })));

  app.use('/api/graphiql', authenticationMiddleware.isLoggedIn, graphiqlExpress({
    endpointURL: '/api/graphql'
  }));

}
