
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    hello: String
  }

  type OpportunityResult {
    title: String
    userEmail: String
  }

  type Mutation {
    createOpportunity(title: String, userId: String) : OpportunityResult
  }
`);

