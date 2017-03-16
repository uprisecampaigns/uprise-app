import React from 'react';
import Welcome from 'scenes/Welcome';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const WelcomeWithAuthentication = withAuthentication(Welcome);

export default {

  path: '/welcome',

  action() {
    return {
      title: 'Welcome',
      component: <Layout><WelcomeWithAuthentication/></Layout>,
    };
  },

};
