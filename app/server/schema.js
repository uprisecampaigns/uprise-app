

const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type UserResult {
    id: String
    first_name: String
    last_name: String
    email: String
    zipcode: String
  }

  type ActivityResult {
    id: String
    title: String!
    description: String
  }

  type TypeResult {
    id: String
    title: String!
    description: String
  }

  type LevelResult {
    id: String
    title: String!
  }

  type IssueAreaResult {
    id: String
    title: String!
  }

  type CampaignResult {
    id: String
    title: String
    slug: String
    description: String
    street_address: String
    street_address2: String
    state: String
    city: String
    phone_number: String
    website_url: String
    zipcode: String
    owner: UserResult
    tags: [String]
    issue_areas: [IssueAreaResult]
    levels: [LevelResult]
  }

  type OpportunityResult {
    id: String
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
    zipcode: String
    location_notes: String
    activities: [ActivityResult]
    issue_areas: [IssueAreaResult]
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

  input CampaignQueryInput {
    slug: String
    id: String
  }

  type Query {
    opportunity(search: OpportunityInput): OpportunityResult
    opportunities(search: OpportunitySearchInput): [OpportunityResult]
    campaigns(search: CampaignSearchInput): [CampaignResult]
    myCampaigns: [CampaignResult]
    campaign(search: CampaignQueryInput): CampaignResult
    activities: [ActivityResult]
    types: [TypeResult]
    levels: [LevelResult]
    issueAreas: [IssueAreaResult]
    me: UserResult
    emailAvailable(email: String): Boolean
  }

  input CreateCampaignInput {
    title: String!
    streetAddress: String
    streetAddress2: String
    websiteUrl: String
    email: String!
    phoneNumber: String
    city: String
    state: String
    zipcode: String
  }

  input EditCampaignInput {
    id: String!
    title: String
    streetAddress: String
    streetAddress2: String
    websiteUrl: String
    email: String
    phoneNumber: String
    city: String
    state: String
    zipcode: String
    issueAreas: [String]
    levels: [String]
    types: [String]
  }

  input DeleteCampaignInput {
    id: String
    slug: String
  }

  type Mutation {
    createCampaign(data: CreateCampaignInput): CampaignResult
    editCampaign(data: EditCampaignInput): CampaignResult
    deleteCampaign(data: DeleteCampaignInput): Boolean
  }
`);
