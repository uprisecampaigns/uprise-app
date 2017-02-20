
const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type UserResult {
    first_name: String
    last_name: String
    email: String
    zip: String
  }

  type ActivityResult {
    title: String!
    description: String
  }

  type TypeResult {
    title: String!
    description: String
  }

  type LevelResult {
    title: String!
  }

  type IssueAreaResult {
    title: String!
  }

  type CampaignResult {
    title: String
    owner_email: String
    keywords: [String]
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

  input CampaignSearchInput {
    title: [String]
    keywords: [String]
    types: [String]
    levels: [String]
    issueAreas: [String]
  }

  input OpportunitySearchInput {
    keywords: [String]
    activities: [String]
    campaignNames: [String]
    types: [String]
    levels: [String]
    issueAreas: [String]
  }


  type Query {
    opportunities(search: OpportunitySearchInput): [OpportunityResult]
    campaigns(search: CampaignSearchInput): [CampaignResult]
    activities: [ActivityResult]
    types: [TypeResult]
    levels: [LevelResult]
    issueAreas: [IssueAreaResult]
    me: UserResult
    emailAvailable(email: String): Boolean
  }

  type Mutation {
    createOpportunity(title: String, userId: String) : OpportunityResult
  }
`);
