
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    hello: String
    opportunity(id: String): OpportunityResult
  }

  type OpportunityResult {
    title: String
    userEmail: String
  }

  type Mutation {
    createOpportunity(title: String, userId: String) : OpportunityResult
  }
`);

