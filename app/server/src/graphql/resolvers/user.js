const decamelize = require('decamelize');

const User = require('models/User');

module.exports = {

  Query: {
    me: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const user = await User.findOne({
        args: { id: context.user.id },
        selections: [
          'users.id as id', 'first_name', 'last_name', 'email',
          'phone_number', 'zipcode', 'email_confirmed',
          'user_profiles.subheader as subheader', 'user_profiles.description as description',
          'user_profiles.profile_image_url as profile_image_url', 'activities',
        ],
      });

      return user;
    },

    emailAvailable: async (root, args, context) => {
      const result = await User.findOne({ args: { email: args.email } });

      let available = true;

      if (result) {
        available = false;
      }

      return available;
    },

    user: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const user = await User.findOne({ args: args.search });

      return user;
    },

    users: async (root, { search }, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      const users = await User.search(search);
      return users;
    },
  },

  Mutation: {
    editAccount: async (root, { data }, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      if (context.user.id !== data.id) {
        throw new Error('Cannot edit another user\'s account info');
      }

      // Decamelizing property names
      const input = Object.assign(...Object.keys(data).map(k => ({
        [decamelize(k)]: data[k],
      })));

      const previousEmail = context.user.email;

      const user = await User.edit(input);

      if (previousEmail !== user.email) {
        await User.edit({ id: user.id, email_confirmed: false });
        await User.sendVerificationEmail(user);
      }

      return user;
    },

    confirmEmail: async (root, args, context) => {
      const { token } = args;

      try {
        await User.verifyEmail({ token });
        return true;
      } catch (err) {
        console.error(`Error confirming email: ${err}`);
        return false;
      }
    },

    resendEmailVerification: async (root, args, context) => {
      if (!context.user) {
        throw new Error('User must be logged in');
      }

      return User.sendVerificationEmail(context.user);
    },
  },
};
