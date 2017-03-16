import React from 'react';
import ViewCalendarList from 'scenes/ViewCalendarList';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const ViewListWithAuthentication = withAuthentication(ViewCalendarList);

export default {

  path: '/calendar/view-list',

  action() {
    return {
      title: 'ViewList',
      component: <Layout><ViewListWithAuthentication/></Layout>,
    };
  },

};
