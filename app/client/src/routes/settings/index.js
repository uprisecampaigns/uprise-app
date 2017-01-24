import React from 'react';
import Settings from './Settings';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const SettingsWithAuthentication = withAuthentication(Settings);

export default {

  path: '/settings',

  action() {
    return {
      title: 'Settings',
      component: <Layout><SettingsWithAuthentication/></Layout>,
    };
  },

};
