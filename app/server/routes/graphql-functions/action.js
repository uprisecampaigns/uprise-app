const decamelize = require('decamelize');
const moment = require('moment');

const Action = require('models/Action');
const Campaign = require('models/Campaign');
const User = require('models/User');

const sendEmail = require('lib/sendEmail.js');

import { urls } from 'config/config'


module.exports = {

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

  myActions: async (data, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const myActions = await Action.usersActions({ userId: context.user.id });

    return myActions;
  },

  activities: async (data, context) => {

    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const activities = await Action.listActivities(data.search);
    return activities;
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

    const startTime = moment(action.start_time);
    const endTime = moment(action.end_time);

    const dates = {
      start: startTime.tz('America/New_York').format("dddd, MMMM Do YYYY, h:mma z"),
      end: endTime.tz('America/New_York').format("dddd, MMMM Do YYYY, h:mma z"),
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

    const icsCalendarUrl  = urls.api + '/calendar-links/ics/' + action.id;
    const googleCalendarUrl = urls.api + '/calendar-links/google/' + action.id;

    try {
      await sendEmail({
        to: user.email,
        subject: 'You Signed up to Volunteer',
        templateName: 'action-signup-volunteer',
        context: { action, dates, user, actionCoordinator, campaign: action.campaign, googleCalendarUrl, icsCalendarUrl }
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


};
