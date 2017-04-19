const graphqlHTTP = require('express-graphql');
const assert = require('assert');
const moment = require('moment');
const S3 = require('aws-sdk/clients/s3');
const decamelize = require('decamelize');
const bodyParser = require('body-parser');
const graphqlServer = require('graphql-server-express');
const graphqlExpress = graphqlServer.graphqlExpress;
const graphiqlExpress = graphqlServer.graphiqlExpress;

const schema = require('../schema');
const authenticationMiddleware = require('middlewares/authentication.js');
const sendEmail = require('lib/sendEmail.js');

const Action = require('models/Action');
const Campaign = require('models/Campaign');
const User = require('models/User');

const awsConfig = require('config/config.js').aws;


const s3 = new S3({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.accessKeySecret,
  region: awsConfig.region
});

module.exports = (app) => {

  const getS3Signature = ({ path, contentType }) => {
    const url = s3.getSignedUrl('putObject', {
      Bucket: awsConfig.bucketName,
      Key: path,
      ACL: 'public-read',
      Expires: awsConfig.expirationTime,
      ContentType: contentType,
    });

    return url;
  };

  const root = {
    me: async (data, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const user = await User.findOne({
        id: context.user.id
      });

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        zipcode: user.zipcode,
      }
    },

    emailAvailable: async (data, context) => {
      const result = await User.findOne('email', data.email);
      let available = true;

      if (result) {
        available = false;
      }

      return available;
    },

    fileUploadSignature: async (data, context) => {

      const { 
        collectionId, collectionName, fileName, 
        contentEncoding, contentType, ...input } = data.input;

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      if (collectionName === 'campaigns') {

        const campaign = await Campaign.findOne('id', collectionId);

        if (!campaign) {
          throw new Error('Campaign not found');
        }

        // TODO: Replace this with more sophisticated implementation
        //       inside of Campaign model
        if (campaign.owner_id !== context.user.id) {
          throw new Error('User must be owner of campaign');
        }
      } else {
        throw new Error('collectionName: ' + collectionName + ' not recognized');
      }

      const path = collectionName + '/' + collectionId + '/' + fileName;

      const url = getS3Signature({ path, contentEncoding, contentType });

      return { 
        url: url,
      };
    },

    action: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const action = await Action.findOne(data.search);
      // TODO: This is repeated in a bunch of places and should be DRYed
      action.attending = await Action.attending({ actionId: action.id, userId: context.user.id });
      return action;
    },

    actions: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const actions = await Action.search(data.search);
      return actions;
    },

    campaign: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const campaign = await Campaign.findOne(data.search);

      // TODO: This is repeated in a bunch of places and should be DRYed
      campaign.subscribed = await Campaign.subscribed({ campaignId: campaign.id, userId: context.user.id });

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

      const myCampaigns = await Campaign.search({
        ownerId: context.user.id
      });
      return myCampaigns;
    },

    activities: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const activities = await Action.listActivities(data.search);
      return activities;
    },

    types: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const types = await Campaign.listTypes(data.search);
      return types;
    },

    levels: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const levels = await Campaign.listLevels(data.search);
      return levels;
    },

    issueAreas: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

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

      input.owner_id = context.user.id;

      const campaign = await Campaign.edit(input);

      return campaign;
    },

    deleteCampaign: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const campaign = await Campaign.findOne(options.data);

      if (campaign.owner_id !== context.user.id) {
        throw new Error('User must own campaign');
      }

      const result = await Campaign.delete(options.data, context.user.id);

      return result;
    },

    deleteAction: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const action = await Action.findOne(options.data);

      if (action.owner_id !== context.user.id) {
        throw new Error('User must own action');
      }

      const result = await Action.delete(options.data, context.user.id);

      return result;
    },


    createAction: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      // Decamelizing property names
      const input = Object.assign(...Object.keys(options.data).map(k => ({
          [decamelize(k)]: options.data[k]
      })));

      input.owner_id = context.user.id;

      const action = await Action.create(input);
      return action;
    },

    editAction: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      // Decamelizing property names
      const input = Object.assign(...Object.keys(options.data).map(k => ({
          [decamelize(k)]: options.data[k]
      })));

      input.owner_id = context.user.id;

      const action = await Action.edit(input);
      return action;
    },

    signedUpVolunteers: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;

      const action = await Action.findOne(data.search);

      if (action.owner_id !== user.id) {
        throw new Error('User must be action coordinator');
      }

      const volunteers = await Action.signedUpVolunteers({ actionId: action.id });

      return volunteers;
    },

    actionSignup: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;

      const action = await Action.signup({ userId: user.id, actionId: options.actionId });
      action.attending = await Action.attending({ actionId: action.id, userId: user.id });

      let actionCoordinator;
      let campaign;

      // TODO: replace with more sophisticated model of "coordinator"
      try {
        actionCoordinator = await User.findOne('id', action.owner_id);
      } catch (e) {
        throw new Error('Cannot find action coordinator: ' + e.message);
      }

      try {
        campaign = await Campaign.findOne('id', action.campaign_id);
      } catch (e) {
        throw new Error('Cannot find matching campaign: ' + e.message);
      }

      try {
        await sendEmail({
          to: actionCoordinator.email,
          subject: user.first_name + ' ' + user.last_name + ' Signed up to Volunteer', 
          templateName: 'action-signup-coordinator',
          context: { action, user, campaign: action.campaign }
        });
      } catch (e) {
        throw new Error('Error sending email to coordinator: ' + e.message);
      }

      try {
        await sendEmail({
          to: user.email,
          subject: 'You Signed up to Volunteer',
          templateName: 'action-signup-volunteer',
          context: { action, user, actionCoordinator, campaign: action.campaign }
        });
      } catch (e) {
        throw new Error('Error sending email to volunteer: ' + e.message);
      }

      return action;
    },

    cancelActionSignup: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const action = await Action.cancelSignup({ userId: context.user.id, actionId: options.actionId });
      action.attending = await Action.attending({ actionId: action.id, userId: context.user.id });

      return action;
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

      if (campaign.owner_id !== user.id) {
        throw new Error('User must be campaign coordinator');
      }

      const volunteers = await Campaign.subscribedUsers({ campaignId: campaign.id });

      return volunteers;
    },


    sendMessage: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;
      const { data } = options;

      // TODO: more sophisticated notion of 'from' emails
      if (data.replyToEmail !== context.user.email) {
        throw new Error('Message must be sent from user\'s email');
      }

      // TODO: more sophisticated determining who can send to whom
      const userActions = await Action.find('owner_id', user.id);
      let allowedRecipients = [];

      // TODO: replace this with parallel promises
      for (let action of userActions) {
        const signedUpVolunteers = await Action.signedUpVolunteers({ actionId: action.id });
        allowedRecipients = allowedRecipients.concat(signedUpVolunteers);
      };

      const allowedEmails = allowedRecipients.map( v => v.email);

      const errors = [];
      data.recipientEmails.forEach( async (recipient) => {

        if (!allowedEmails.includes(recipient)) {
          errors.push('User not allowed to message ' + recipient);
        } else {
          try {
            await sendEmail({
              to: recipient,
              replyTo: data.replyToEmail,
              subject: data.subject,
              templateName: 'compose-message',
              context: { user, body: data.body }
            });
          } catch (e) {
            console.error(e);
            errors.push(e.message);
          }
        }
      });

      if (errors.length) {
        throw new Error('Errors sending email: ' + errors.join(' | '));
      }

      return true;
    },
  };

  app.use('/api/graphql', graphqlExpress(req => ({
    schema: schema,
    rootValue: root,
    context: { user: req.user },
    debug: (app.get('env') === 'development')
  })));

  app.use('/api/graphiql', authenticationMiddleware.isLoggedIn, graphiqlExpress({
    endpointURL: '/api/graphql'
  }));

}
