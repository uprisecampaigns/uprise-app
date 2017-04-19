import React from 'react';
import MyActions from 'scenes/MyActions';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const MyActionsWithAuthentication = withAuthentication(MyActions);

export default {

  path: '/actions',

  action() {
    return {
      title: 'Actions',
      component: <Layout><MyActionsWithAuthentication/></Layout>,
    };
  },
};
