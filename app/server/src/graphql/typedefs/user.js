/* eslint-disable no-unused-vars, func-names */
const { ActivityResult, ActionResult } = require('./action.js');
const { CampaignResult } = require('./campaign.js');
const { GeographySearchInput } = require('./searchInputs.js');

const UserResult = `
  type UserResult {
    id: String!
    first_name: String
    last_name: String
    phone_number: String
    email: String
    zipcode: String
    city: String
    state: String
    email_confirmed: Boolean
    description: String
    profile_image_url: String
    subheader: String
    activities: [ActivityResult]
    actions: [ActionResult]
    campaigns: [CampaignResult]
    tags: [String]
  }
`;

const EditAccountInput = `
  input EditAccountInput {
    id: String!
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    city: String
    state: String
    zipcode: String
    activities: [String]
    tags: [String]
    description: String
    profileImageUrl: String
    subheader: String
  }
`;

const UserQueryInput = `
  input UserQueryInput {
    id: String
  }
`;

const UserSearchInput = `
  input UserSearchInput {
    names: [String]
    keywords: [String]
    tags: [String]
    geographies: [GeographySearchInput]
  }
`;

const UserQueries = `
  extend type Query {
    me: UserResult
    emailAvailable(email: String): Boolean
    user(search: UserQueryInput): UserResult
    users(search: UserSearchInput): [UserResult]
  }
`;

const UserMutations = `
  extend type Mutation {
    editAccount(data: EditAccountInput): UserResult
    resendEmailVerification: Boolean
    confirmEmail(token: String!): Boolean
  }
`;

module.exports = function () {
  return [
    UserResult, EditAccountInput,
    UserQueryInput, UserSearchInput,
    UserMutations, UserQueries,
  ];
};
