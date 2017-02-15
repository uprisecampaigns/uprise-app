
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type UserResult {
    first_name: String
    last_name: String
    email: String
    zip: String
  }

  input OpportunitySearchInput {
    tags: [String]
    activities: [String]
    campaign_name: [String]
    type: [String]
    level: [String]
    issues: [String]
  }

  type OpportunityResult {
    title: String
    start_time: String
    end_time: String
    tags: [String]
    location_name: String
    street_address: String
    street_address2: String
    city: String
    state: String
    zip: String
    location_notes: String

  }

  type Query {
    opportunities(search: OpportunitySearchInput): [OpportunityResult]
    me: UserResult
    emailAvailable(email: String): Boolean
  }

  type Mutation {
    createOpportunity(title: String, userId: String) : OpportunityResult
  }
`);
