

const { buildSchema } = require('graphql');

module.exports = buildSchema(`

  type UserResult {
    id: String!
    first_name: String
    last_name: String
    phone_number: String
    email: String
    zipcode: String
  }

  type ActivityResult {
    id: String!
    title: String!
    description: String
  }

  type TypeResult {
    id: String!
    title: String!
    description: String
  }

  type LevelResult {
    id: String!
    title: String!
  }

  type IssueAreaResult {
    id: String!
    title: String!
  }

  type CampaignResult {
    id: String!
    title: String
    slug: String
    description: String
    subscribed: Boolean
    street_address: String
    street_address2: String
    state: String
    city: String
    zipcode: String
    location_state: String
    location_district_number: String
    legislative_district_type: String
    location_type: String
    zipcode_list: [String]
    phone_number: String
    website_url: String
    profile_image_url: String
    profile_subheader: String
    owner: UserResult
    tags: [String]
    issue_areas: [IssueAreaResult]
    levels: [LevelResult]
    types: [TypeResult]
    actions: [ActionResult]
  }

  type ActionResult {
    id: String!
    title: String
    internal_title: String
    slug: String
    description: String
    start_time: String
    end_time: String
    tags: [String]
    virtual: Boolean
    attending: Boolean
    location_name: String
    street_address: String
    street_address2: String
    city: String
    state: String
    zipcode: String
    location_notes: String
    public_url: String
    activities: [ActivityResult]
    issue_areas: [IssueAreaResult]
    levels: [LevelResult]
    types: [TypeResult]
    owner: UserResult
    campaign: CampaignResult
  }

  type FileUploadSignatureResult {
    url: String!
  }

  input DateSearchInput {
    onDate: String
    startDate: String
    endDate: String
  }

  input GeographySearchInput {
    zipcode: String
    distance: Int
    virtual: Boolean
  }

  input CampaignSearchInput {
    id: [String]
    title: [String]
    keywords: [String]
    types: [String]
    levels: [String]
    issueAreas: [String]
    geographies: [GeographySearchInput]
  }

  input SortByInput {
    name: String
    descending: Boolean
  }

  input ActionSearchInput {
    ids: [String]
    slugs: [String]
    keywords: [String]
    activities: [String]
    campaignIds: [String]
    campaignNames: [String]
    types: [String]
    levels: [String]
    issueAreas: [String]
    dates: DateSearchInput
    times: [String]
    geographies: [GeographySearchInput]
    sortBy: SortByInput
  }

  input ActionQueryInput {
    id: String
    slug: String
  }

  input CampaignQueryInput {
    slug: String
    id: String
  }

  input FileToUpload {
    collectionId: String!
    collectionName: String!
    fileName: String!
    contentType: String!
  }

  type Query {
    action(search: ActionQueryInput): ActionResult
    myActions: [ActionResult]
    actions(search: ActionSearchInput): [ActionResult]
    signedUpVolunteers(search: ActionQueryInput): [UserResult]
    subscribedUsers(search: CampaignQueryInput): [UserResult]
    campaigns(search: CampaignSearchInput): [CampaignResult]
    myCampaigns: [CampaignResult]
    campaign(search: CampaignQueryInput): CampaignResult
    activities: [ActivityResult]
    types: [TypeResult]
    levels: [LevelResult]
    issueAreas: [IssueAreaResult]
    me: UserResult
    emailAvailable(email: String): Boolean
    fileUploadSignature(input: FileToUpload!): FileUploadSignatureResult
  }

  input EditAccountInput {
    id: String!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    city: String
    state: String
    zipcode: String
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
    description: String
    profileSubheader: String
    profileAboutContent: String
    streetAddress: String
    streetAddress2: String
    websiteUrl: String
    profileImageUrl: String
    email: String
    phoneNumber: String
    city: String
    state: String
    zipcode: String
    zipcodeList: [String]
    locationType: String
    locationState: String
    locationDistrictNumber: String
    legislativeDistrictType: String
    issueAreas: [String]
    levels: [String]
    types: [String]
    tags: [String]
  }

  input DeleteCampaignInput {
    id: String!
  }

  input DeleteActionInput {
    id: String!
  }

  input CreateActionInput {
    title: String!
    internalTitle: String!
    campaignId: String!
    virtual: Boolean
    locationName: String
    streetAddress: String
    streetAddress2: String
    city: String
    state: String
    zipcode: String
    locationNotes: String
    startTime: String
    endTime: String
  }

  input EditActionInput {
    id: String!
    title: String
    internalTitle: String
    campaignId: String
    description: String
    virtual: Boolean
    locationName: String
    streetAddress: String
    streetAddress2: String
    city: String
    state: String
    zipcode: String
    locationNotes: String
    startTime: String
    endTime: String
    activities: [String]
    issueAreas: [String]
    levels: [String]
    types: [String]
    tags: [String]
  }

  input SendMessageInput {
    replyToEmail: String!
    recipientEmails: [String]!
    subject: String
    body: String
  }

  input ContactInput {
    subject: String!
    body: String!
  }

  type Mutation {
    editAccount(data: EditAccountInput): UserResult
    createCampaign(data: CreateCampaignInput): CampaignResult
    editCampaign(data: EditCampaignInput): CampaignResult
    deleteCampaign(data: DeleteCampaignInput): Boolean
    deleteAction(data: DeleteActionInput): Boolean
    createAction(data: CreateActionInput): ActionResult
    editAction(data: EditActionInput): ActionResult
    actionSignup(actionId: String!): ActionResult
    cancelActionSignup(actionId: String!): ActionResult
    campaignSubscription(campaignId: String!): CampaignResult
    cancelCampaignSubscription(campaignId: String!): CampaignResult
    sendMessage(data: SendMessageInput!): Boolean
    contact(data: ContactInput!): Boolean
  }
`);
