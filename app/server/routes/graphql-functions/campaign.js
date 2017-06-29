const decamelize = require('decamelize');

const Campaign = require('models/Campaign');
const User = require('models/User');
const sendEmail = require('lib/sendEmail.js');

module.exports = {

  campaign: async (data, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const campaign = await Campaign.findOne(data.search);

    // TODO: This is repeated in a bunch of places and should be DRYed
    campaign.subscribed = await Campaign.subscribed({ campaignId: campaign.id, userId: context.user.id });

    campaign.is_owner = User.ownsObject({ user: context.user, object: campaign });

    return campaign;
  },

  campaigns: async (data, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const campaigns = await Campaign.search(data.search);
    return campaigns;
  },

  myCampaigns: async (data, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    let myCampaigns;
    if (context.user.superuser) {
      myCampaigns = Campaign.search({});
    } else {

      myCampaigns = await Campaign.search({
        ownerId: context.user.id
      });
    }

    return myCampaigns;
  },

  campaignSubscriptions: async (data, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const campaignSubscriptions = await Campaign.usersSubscriptions({ userId: context.user.id });

    return campaignSubscriptions;
  },


  types: async (data, context) => {
    const types = await Campaign.listTypes(data.search);
    return types;
  },

  levels: async (data, context) => {
    const levels = await Campaign.listLevels(data.search);
    return levels;
  },

  issueAreas: async (data, context) => {
    const issueAreas = await Campaign.listIssueAreas(data.search);
    return issueAreas;
  },

  createCampaign: async (options, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    // Decamelizing property names
    const input = Object.assign(...Object.keys(options.data).map(k => ({
        [decamelize(k)]: options.data[k]
    })));

    input.owner_id = context.user.id;

    const campaign = await Campaign.create(input);

    return campaign;
  },

  editCampaign: async (options, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    // Decamelizing property names
    const input = Object.assign(...Object.keys(options.data).map(k => ({
        [decamelize(k)]: options.data[k]
    })));

    const campaign = await Campaign.edit({ input, userId: context.user.id });

    return campaign;
  },

  deleteCampaign: async (options, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const campaign = await Campaign.findOne(options.data);

    if (!User.ownsObject({ user: context.user, object: campaign })) {
      throw new Error('User must own campaign');
    }

    const result = await Campaign.delete(options.data, context.user.id);

    return result;
  },

  campaignSubscription: async (options, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const { user } = context;

    const campaign = await Campaign.subscribe({ userId: user.id, campaignId: options.campaignId });
    campaign.subscribed = await Campaign.subscribed({ campaignId: campaign.id, userId: user.id });

    let campaignCoordinator;

    // TODO: replace with more sophisticated model of "coordinator"
    try {
      campaignCoordinator = await User.findOne('id', campaign.owner_id);
    } catch (e) {
      throw new Error('Cannot find campaign coordinator: ' + e.message);
    }

    try {
      await sendEmail({
        to: campaignCoordinator.email,
        subject: user.first_name + ' ' + user.last_name + ' Subscribed to your Campaign', 
        templateName: 'campaign-subscription-coordinator',
        context: { campaign, user }
      });
    } catch (e) {
      throw new Error('Error sending email to coordinator: ' + e.message);
    }

    try {
      await sendEmail({
        to: user.email,
        subject: 'You Subscribed to a Campaign',
        templateName: 'campaign-subscription-user',
        context: { campaign, user, campaignCoordinator }
      });
    } catch (e) {
      throw new Error('Error sending email to user: ' + e.message);
    }

    return campaign;
  },

  cancelCampaignSubscription: async (options, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const campaign = await Campaign.cancelSubscription({ userId: context.user.id, campaignId: options.campaignId });
    campaign.subscribed = await Campaign.subscribed({ campaignId: campaign.id, userId: context.user.id });

    return campaign;
  },

  subscribedUsers: async (data, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const { user } = context;

    const campaign = await Campaign.findOne(data.search);

    if (!User.ownsObject({ user: user, object: campaign })) {
      throw new Error('User must be campaign coordinator');
    }

    const volunteers = await Campaign.subscribedUsers({ campaignId: campaign.id });

    return volunteers;
  },


};
