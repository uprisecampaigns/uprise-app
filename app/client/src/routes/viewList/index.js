import React from 'react';
import ViewList from './ViewList';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const ViewListWithAuthentication = withAuthentication(ViewList);

export default {

  path: '/calendar/view-list',

  action() {
    return {
      title: 'ViewList',
      component: <Layout><ViewListWithAuthentication/></Layout>,
    };
  },

};
