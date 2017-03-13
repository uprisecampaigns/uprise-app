const graphqlHTTP = require('express-graphql');
const assert = require('assert');
const bodyParser = require('body-parser');
const graphqlServer = require('graphql-server-express');
const graphqlExpress = graphqlServer.graphqlExpress;
const graphiqlExpress = graphqlServer.graphiqlExpress;

const schema = require('../schema');
const authenticationMiddleware = require('middlewares/authentication.js');

const Opportunity = require('models/Opportunity');
const Campaign = require('models/Campaign');
const User = require('models/User');

module.exports = (app) => {

  const root = {
    me: async (data, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const user = await User.findOne({
        id: context.user.id
      });

      return {
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

    opportunity: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      console.log(data);

      const opportunity = await Opportunity.findOne(data.search);
      console.log(opportunity);
      return opportunity;
    },

    opportunities: async (data, context) => {

      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const opportunities = await Opportunity.search(data.search);
      console.log(opportunities);
      return opportunities;
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

      const activities = await Opportunity.listActivities(data.search);
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

      const campaign = await Campaign.create({
        owner_id: context.user.id,
        title: options.data.title,
        street_address: options.data.streetAddress,
        street_address2: options.data.streetAddress2,
        website_url: options.data.websiteUrl,
        city: options.data.city,
        state: options.data.state,
        zipcode: options.data.zipcode,
        email: options.data.email,
      });

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
    }

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
