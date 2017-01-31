
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    opportunity(id: String): OpportunityResult
    me: UserResult
  }

  type UserResult {
    email: String
    zip: String
  }

  type OpportunityResult {
    title: String
    userEmail: String
  }

  type Mutation {
    createOpportunity(title: String, userId: String) : OpportunityResult
  }
`);
