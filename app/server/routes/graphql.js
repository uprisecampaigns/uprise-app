const graphqlHTTP = require('express-graphql');
const schema = require('../schema');
const authenticationMiddleware = require('middlewares/authentication.js');

const Opportunity = require('models/Opportunity');
const User = require('models/User');

module.exports = (app) => {

  const root = {
    hello: () => {
      return 'Hello World!';
    },
    createOpportunity: async (data, req) => {
      console.log(data);
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

  app.use('/api/graphql', authenticationMiddleware.isLoggedIn, graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  }));
}
