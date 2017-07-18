import React from 'react';
import Organize from 'scenes/Organize';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const OrganizeWithAuthentication = withAuthentication(Organize);

export default {

  path: '/organize',

  action() {
    return {
      title: 'Organize',
      component: <Layout><OrganizeWithAuthentication /></Layout>,
    };
  },

};
