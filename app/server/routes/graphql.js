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

      console.log(path);

      const url = getS3Signature({ path, contentEncoding, contentType });

      console.log(url);

      return { 
        url: url,
      };
    },

    action: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const action = await Action.findOne(data.search);
      action.attending = await Action.attending({ actionId: action.id, userId: context.user.id });
      return action;
    },

    actions: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const actions = await Action.search(data.search);
      console.log(actions);
      return actions;
    },

    campaign: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      console.log(data);

      const campaign = await Campaign.findOne(data.search);
      console.log(campaign);
      return campaign;
    },

    campaigns: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const campaigns = await Campaign.search(data.search);
      console.log(campaigns);
      return campaigns;
    },

    myCampaigns: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const myCampaigns = await Campaign.search({
        ownerId: context.user.id
      });
      console.log(myCampaigns);
      return myCampaigns;
    },

    activities: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const activities = await Action.listActivities(data.search);
      console.log(activities);
      return activities;
    },

    types: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const types = await Campaign.listTypes(data.search);
      console.log(types);
      return types;
    },

    levels: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const levels = await Campaign.listLevels(data.search);
      console.log(levels);
      return levels;
    },

    issueAreas: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const issueAreas = await Campaign.listIssueAreas(data.search);
      console.log(issueAreas);
      return issueAreas;
    },

    createCampaign: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      console.log(options.data);

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

      console.log(options.data);

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

      console.log(options);
      console.log(options.data);

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

      console.log(options);
      console.log(options.data);

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

      console.log(options.data);

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

      console.log(options.data);

      // Decamelizing property names
      const input = Object.assign(...Object.keys(options.data).map(k => ({
          [decamelize(k)]: options.data[k]
      })));

      input.owner_id = context.user.id;

      const action = await Action.edit(input);
      return action;
    },

    actionSignup: async (options, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const action = await Action.signup({ userId: context.user.id, actionId: options.actionId });
      action.attending = await Action.attending({ actionId: action.id, userId: context.user.id });

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
