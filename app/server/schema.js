
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type UserResult {
    first_name: String
    last_name: String
    email: String
    zip: String
  }

  input OpportunitySearchInput {
    keywords: [String]
    activities: [String]
    campaign_name: [String]
    type: [String]
    level: [String]
    issues: [String]
  }

  input ActivitySearchInput {
    title: String
    keywords: [String]
  }

  type ActivityResult {
    title: String!
    description: String
  }

  type OpportunityResult {
    title: String
    start_time: String
    end_time: String
    keywords: [String]
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
    activities(search: ActivitySearchInput): [ActivityResult]
    me: UserResult
    emailAvailable(email: String): Boolean
  }

  type Mutation {
    createOpportunity(title: String, userId: String) : OpportunityResult
  }
`);
