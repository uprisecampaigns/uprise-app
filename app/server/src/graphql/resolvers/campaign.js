const decamelize = require('decamelize');

const Campaign = require('models/Campaign');
const User = require('models/User');
const sendEmail = require('lib/sendEmail.js');

module.exports = {

  Query: {
    campaign: async (root, args, context) => {
      const campaign = await Campaign.findOne(args.search);

      // TODO: This is repeated in a bunch of places and should be DRYed
      campaign.subscribed = (context.user) ? await Campaign.subscribed({ campaignId: campaign.id, userId: context.user.id }) : false;

      campaign.is_owner = (context.user) ? User.ownsObject({ user: context.user, object: campaign }) : false;

      return campaign;
    },

    campaigns: async (root, args, context) => {
      const campaigns = await Campaign.search(args.search);
      return campaigns;
    },

    myCampaigns: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      let myCampaigns;
      if (context.user.superuser) {
        myCampaigns = Campaign.search({});
      } else {
        myCampaigns = await Campaign.search({
          ownerId: context.user.id,
        });
      }

      return myCampaigns;
    },

    campaignSubscriptions: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const campaignSubscriptions = await Campaign.usersSubscriptions({ userId: context.user.id });

      return campaignSubscriptions;
    },

    subscribedUsers: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;

      const campaign = await Campaign.findOne(args.search);

      if (!User.ownsObject({ user, object: campaign })) {
        throw new Error('User must be campaign coordinator');
      }

      const volunteers = await Campaign.subscribedUsers({ campaignId: campaign.id });

      return volunteers;
    },
  },

  Mutation: {
    createCampaign: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      // Decamelizing property names
      const input = Object.assign(...Object.keys(args.data).map(k => ({
        [decamelize(k)]: args.data[k],
      })));

      input.owner_id = context.user.id;

      const campaign = await Campaign.create(input);

      return campaign;
    },

    editCampaign: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      // Decamelizing property names
      const input = Object.assign(...Object.keys(args.data).map(k => ({
        [decamelize(k)]: args.data[k],
      })));

      const campaign = await Campaign.edit({ input, userId: context.user.id });

      return campaign;
    },

    deleteCampaign: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const result = await Campaign.delete({ input: args.data, userId: context.user.id });

      return result;
    },

    campaignSubscription: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;

      const campaign = await Campaign.subscribe({ userId: user.id, campaignId: args.campaignId });
      campaign.subscribed = await Campaign.subscribed({ campaignId: campaign.id, userId: user.id });

      let campaignCoordinator;

      // TODO: replace with more sophisticated model of "coordinator"
      try {
        campaignCoordinator = await User.findOne('id', campaign.owner_id);
      } catch (e) {
        throw new Error(`Cannot find campaign coordinator: ${e.message}`);
      }

      try {
        await sendEmail({
          to: campaignCoordinator.email,
          subject: `${user.first_name} ${user.last_name} Subscribed to your Campaign`,
          templateName: 'campaign-subscription-coordinator',
          context: { campaign, user },
        });
      } catch (e) {
        throw new Error(`Error sending email to coordinator: ${e.message}`);
      }

      try {
        await sendEmail({
          to: user.email,
          subject: 'You Subscribed to a Campaign',
          templateName: 'campaign-subscription-user',
          context: { campaign, user, campaignCoordinator },
        });
      } catch (e) {
        throw new Error(`Error sending email to user: ${e.message}`);
      }

      return campaign;
    },

    cancelCampaignSubscription: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const campaign = await Campaign.cancelSubscription({ userId: context.user.id, campaignId: args.campaignId });
      campaign.subscribed = await Campaign.subscribed({ campaignId: campaign.id, userId: context.user.id });

      return campaign;
    },
  },
};
