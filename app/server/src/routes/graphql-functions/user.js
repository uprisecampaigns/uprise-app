const decamelize = require('decamelize');

const User = require('models/User');

module.exports = {

  me: async (data, context) => {
    if (!context.user) {
      throw new Error('User must be logged in');
    }

    const user = await User.findOne({
      id: context.user.id,
    });

    return user;
  },

  emailAvailable: async (data, context) => {
    const result = await User.findOne('email', data.email);
    let available = true;

    if (result) {
      available = false;
    }

    return available;
  },

  editAccount: async ({ data }, context) => {
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

  confirmEmail: async (data, context) => {
    const { token } = data;

    try {
      const result = await User.verifyEmail({ token });
      return true;
    } catch (err) {
      return false;
    }
  },

  resendEmailVerification: async (data, context) => {
    if (!context.user) {
      throw new Error('User must be logged in');
    }

    return await User.sendVerificationEmail(context.user);
  },

};
