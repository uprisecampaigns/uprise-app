
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type Query {
    opportunity(id: String): OpportunityResult
    me: UserResult
    emailAvailable(email: String): Boolean
  }

  type UserResult {
    first_name: String
    last_name: String
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
