



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
    slug: String
    description: String
    owner: UserResult
    keywords: [String]
  }

  type OpportunityResult {
    title: String
    slug: String
    description: String
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
    activities: [ActivityResult]
    issueAreas: [IssueAreaResult]
    owner: UserResult
    campaign: CampaignResult
  }

  input DateSearchInput {
    onDate: String
    startDate: String
    endDate: String
  }

  input GeographySearchInput {
    zipcode: String
    distance: Int
  }

  input CampaignSearchInput {
    title: [String]
    keywords: [String]
    types: [String]
    levels: [String]
    issueAreas: [String]
  }

  input SortByInput {
    name: String
    descending: Boolean
  }

  input OpportunitySearchInput {
    keywords: [String]
    activities: [String]
    campaignNames: [String]
    types: [String]
    levels: [String]
    issueAreas: [String]
    dates: DateSearchInput
    times: [String]
    geographies: [GeographySearchInput]
    sortBy: SortByInput
  }

  input OpportunityInput {
    slug: String
  }

  type Query {
    opportunity(search: OpportunityInput): OpportunityResult
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
