const User = require('models/User');

module.exports = {

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

};
