const decamelize = require('decamelize');
const moment = require('moment-timezone');
const zipcodeToTimezone = require('zipcode-to-timezone');

const Action = require('models/Action');
const User = require('models/User');

const sendEmail = require('lib/sendEmail.js');

const { urls } = require('config/config');


const getFormattedDates = ({ user, action }) => {
  if (action.ongoing) {
    return { ongoing: true };
  }

  const startTime = moment(action.start_time);
  const endTime = moment(action.end_time);

  const timezone = (user.zipcode && zipcodeToTimezone.lookup(user.zipcode)) ? zipcodeToTimezone.lookup(user.zipcode) : 'America/New_York';

  return {
    timezone,
    start: startTime.tz(timezone).format('dddd, MMMM Do YYYY, h:mma z'),
    end: endTime.tz(timezone).format('dddd, MMMM Do YYYY, h:mma z'),
  };
};

module.exports = {
  Query: {
    action: async (root, args, context) => {
      const action = await Action.findOne(args.search);

      // TODO: This is repeated in a bunch of places and should be DRYed
      action.attending = (context.user) ? await Action.attending({ actionId: action.id, userId: context.user.id }) : false;

      action.is_owner = (context.user) ? await User.ownsObject({ user: context.user, object: action }) : false;

      return action;
    },

    actions: async (root, args, context) => {
      const actions = await Action.search(args.search);
      return actions;
    },

    actionCommitments: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const actionCommitments = await Action.usersActions({ userId: context.user.id });

      return actionCommitments;
    },

    activities: async (root, args, context) => {
      const activities = await Action.listActivities(args.search);
      return activities;
    },

    signedUpVolunteers: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;

      const action = await Action.findOne(args.search);

      if (!await User.ownsObject({ user, object: action })) {
        throw new Error('User must be action coordinator');
      }

      const volunteers = await Action.signedUpVolunteers({ actionId: action.id });

      return volunteers;
    },
  },

  Mutation: {
    deleteAction: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const result = await Action.delete({ input: args.data, userId: context.user.id });

      return result;
    },

    createAction: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      // Decamelizing property names
      const input = Object.assign(...Object.keys(args.data).map(k => ({
        [decamelize(k)]: args.data[k],
      })));

      input.owner_id = context.user.id;

      const action = await Action.create(input);
      return action;
    },

    createActions: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const actionCreations = [];

      args.data.forEach((item) => {
        // Decamelizing property names
        const input = Object.assign(...Object.keys(item).map(k => ({
          [decamelize(k)]: item[k],
        })));

        input.owner_id = context.user.id;

        actionCreations.push(Action.create(input));
      });

      const createdActions = await Promise.all(actionCreations);

      return createdActions;
    },


    editAction: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      // Decamelizing property names
      const input = Object.assign(...Object.keys(args.data).map(k => ({
        [decamelize(k)]: args.data[k],
      })));

      const action = await Action.edit({ input, userId: context.user.id });
      return action;
    },

    actionSignup: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const { user } = context;

      const action = await Action.signup({ userId: user.id, actionId: args.actionId });
      action.attending = await Action.attending({ actionId: action.id, userId: user.id });

      let actionCoordinator;

      // TODO: replace with more sophisticated model of "coordinator"
      try {
        actionCoordinator = await User.findOne({ args: { 'users.id': action.owner_id }, selections: ['email'] });
      } catch (e) {
        throw new Error(`Cannot find action coordinator: ${e.message}`);
      }

      const dates = getFormattedDates({ user, action });

      try {
        await sendEmail({
          to: actionCoordinator.email,
          subject: `${user.first_name} ${user.last_name} Signed up to Volunteer`,
          templateName: 'action-signup-coordinator',
          context: {
            action, user, dates, campaign: action.campaign,
          },
        });
      } catch (e) {
        throw new Error(`Error sending email to coordinator: ${e.message}`);
      }

      const icsCalendarUrl = `${urls.api}/calendar-links/ics/${action.id}`;
      const googleCalendarUrl = `${urls.api}/calendar-links/google/${action.id}`;

      try {
        await sendEmail({
          to: user.email,
          subject: 'You Signed up to Volunteer',
          templateName: 'action-signup-volunteer',
          context: {
            action, dates, user, actionCoordinator, campaign: action.campaign, googleCalendarUrl, icsCalendarUrl,
          },
        });
      } catch (e) {
        throw new Error(`Error sending email to volunteer: ${e.message}`);
      }

      return action;
    },

    cancelActionSignup: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const action = await Action.cancelSignup({ userId: context.user.id, actionId: args.actionId });
      action.attending = await Action.attending({ actionId: action.id, userId: context.user.id });

      return action;
    },
  },
};
