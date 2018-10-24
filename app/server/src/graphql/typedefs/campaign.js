/* eslint-disable no-unused-vars, func-names */
const { UserResult } = require('./user.js');
const { ActionResult } = require('./action.js');
const { GeographySearchInput } = require('./searchInputs.js');

const CampaignResult = `
  type CampaignResult {
    id: String!
    title: String
    slug: String
    description: String
    subscribed: Boolean
    is_owner: Boolean
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
    public_url: String
    dashboard_url: String
    profile_image_url: String
    profile_subheader: String
    legal_org: Boolean
    org_website: String
    org_name: String
    org_status: String
    org_contact_name: String
    org_contact_position: String
    org_contact_email: String
    org_contact_phone: String
    ngp_name: String
    ngp_key: String
    owner: UserResult
    tags: [String]
    actions: [ActionResult]
  }
`;

const CampaignSearchInput = `
  input CampaignSearchInput {
    id: [String]
    title: [String]
    keywords: [String]
    tags: [String]
    geographies: [GeographySearchInput]
  }
`;

const CampaignQueryInput = `
  input CampaignQueryInput {
    slug: String
    id: String
  }
`;

const CreateCampaignInput = `
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
`;

const EditCampaignInput = `
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
    legalOrg: Boolean
    orgWebsite: String
    orgName: String
    orgStatus: String
    orgContactName: String
    orgContactPosition: String
    orgContactEmail: String
    orgContactPhone: String
    ngpName: String
    ngpKey: String
    tags: [String]
  }
`;

const DeleteCampaignInput = `
  input DeleteCampaignInput {
    id: String!
  }
`;

const CampaignQueries = `
  extend type Query {
    campaignSubscriptions: [CampaignResult]
    campaigns(search: CampaignSearchInput): [CampaignResult]
    myCampaigns: [CampaignResult]
    campaign(search: CampaignQueryInput): CampaignResult
    subscribedUsers(search: CampaignQueryInput): [UserResult]
  }
`;

const CampaignMutations = `
  extend type Mutation {
    createCampaign(data: CreateCampaignInput): CampaignResult
    editCampaign(data: EditCampaignInput): CampaignResult
    deleteCampaign(data: DeleteCampaignInput): Boolean
    campaignSubscription(campaignId: String!): CampaignResult
    cancelCampaignSubscription(campaignId: String!): CampaignResult
  }
`;

module.exports = function() {
  return [
    CampaignResult,
    CampaignSearchInput,
    CampaignQueryInput,
    CreateCampaignInput,
    EditCampaignInput,
    DeleteCampaignInput,
    CampaignQueries,
    CampaignMutations,
  ];
};
