const { makeExecutableSchema } = require('graphql-tools');
const merge = require('lodash.merge');

const userTypeDefs = require('./typedefs/user.js');
const actionTypeDefs = require('./typedefs/action.js');
const campaignTypeDefs = require('./typedefs/campaign.js');
const messagingTypeDefs = require('./typedefs/messaging.js');
const searchInputsTypeDefs = require('./typedefs/searchInputs.js');
const uploadTypeDefs = require('./typedefs/upload.js');

const userResolvers = require('./resolvers/user.js');
const actionResolvers = require('./resolvers/action.js');
const campaignResolvers = require('./resolvers/campaign.js');
const miscResolvers = require('./resolvers/misc.js');

const mergedResolvers = merge(userResolvers, actionResolvers, campaignResolvers, miscResolvers);

const rootQuery = `
  type Query {
    test: Boolean
  }
`;

const rootMutation = `
  type Mutation {
    test: Boolean
  }
`;

module.exports = makeExecutableSchema({
  typeDefs: [
    rootQuery, rootMutation,
    userTypeDefs, actionTypeDefs, campaignTypeDefs, messagingTypeDefs,
    searchInputsTypeDefs, uploadTypeDefs,
  ],
  resolvers: mergedResolvers,
});
