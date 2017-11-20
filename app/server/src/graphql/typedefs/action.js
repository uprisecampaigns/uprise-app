/* eslint-disable no-unused-vars, func-names */
const { UserResult } = require('./user.js');
const { CampaignResult } = require('./campaign.js');


const ActivityResult = `
  type ActivityResult {
    id: String!
    title: String!
    description: String
  }
`;

const ActionResult = `
  type ActionResult {
    id: String!
    title: String
    internal_title: String
    slug: String
    description: String
    start_time: String
    end_time: String
    created_at: String
    tags: [String]
    virtual: Boolean
    ongoing: Boolean
    attending: Boolean
    is_owner: Boolean
    location_name: String
    street_address: String
    street_address2: String
    city: String
    state: String
    zipcode: String
    distance: String
    location_notes: String
    public_url: String
    activities: [ActivityResult]
    owner: UserResult
    campaign: CampaignResult
  }
`;

const ActionSearchResult = `
  type ActionSearchResult {
    total: Int!
    cursor: ActionResult
    targetZipcode: String
    actions: [ActionResult]!
  }
`;

const ActionSearchInput = `
  input ActionSearchInput {
    ids: [String]
    slugs: [String]
    keywords: [String]
    tags: [String]
    activities: [String]
    campaignIds: [String]
    campaignNames: [String]
    dates: DateSearchInput
    times: [String]
    geographies: [GeographySearchInput]
    targetZipcode: String
    sortBy: SortByInput
    cursor: ActionCursorInput
    limit: Int
  }
`;

const ActionCursorInput = `
  input ActionCursorInput {
    id: String
    slug: String
    start_time: String
    created_at: String
    campaign_name: String
    distance: String
  }
`;

const ActionQueryInput = `
  input ActionQueryInput {
    id: String
    slug: String
  }
`;


const DeleteActionInput = `
  input DeleteActionInput {
    id: String!
  }
`;

const CreateActionInput = `
  input CreateActionInput {
    title: String!
    internalTitle: String
    campaignId: String!
    description: String
    virtual: Boolean
    ongoing: Boolean
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
    tags: [String]
  }
`;

const EditActionInput = `
  input EditActionInput {
    id: String!
    title: String
    internalTitle: String
    campaignId: String
    description: String
    virtual: Boolean
    ongoing: Boolean
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
    tags: [String]
  }
`;

const ActionQueries = `
  extend type Query {
    action(search: ActionQueryInput): ActionResult
    actionCommitments: [ActionResult]
    actions(search: ActionSearchInput): ActionSearchResult
    activities: [ActivityResult],
    signedUpVolunteers(search: ActionQueryInput): [UserResult]
  }
`;

const ActionMutations = `
  extend type Mutation {
    deleteAction(data: DeleteActionInput): Boolean
    createAction(data: CreateActionInput): ActionResult
    createActions(data: [CreateActionInput]): [ActionResult]
    editAction(data: EditActionInput): ActionResult
    actionSignup(actionId: String!): ActionResult
    cancelActionSignup(actionId: String!): ActionResult
  }
`;

module.exports = function () {
  return [
    ActivityResult, ActionResult, ActionSearchResult,
    ActionSearchInput, ActionCursorInput, ActionQueryInput,
    DeleteActionInput, CreateActionInput, EditActionInput,
    ActionQueries, ActionMutations,
  ];
};
