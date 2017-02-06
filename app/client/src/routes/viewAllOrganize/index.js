import React from 'react';
import ViewAllOrganize from './ViewAllOrganize';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const ViewAllOrganizeWithAuthentication = withAuthentication(ViewAllOrganize);

export default {

  path: '/organize/view-all',

  action() {
    return {
      title: 'View Calendar',
      component: <Layout><ViewAllOrganizeWithAuthentication/></Layout>,
    };
  },

};
