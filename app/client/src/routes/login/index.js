
import React from 'react';
import Layout from 'components/Layout';
import Login from 'scenes/Login';

import withAuthentication from 'routes/withAuthentication';

const LoginWithAuthentication = withAuthentication(Login);


export default {

  path: '/login',

  async action(context) {
    return {
      title: 'Login',
      component: <Layout><LoginWithAuthentication /></Layout>,
    };
  },
};
