import React from 'react';
import EditActivities from 'scenes/EditActivities';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/settings/activities',

  action({ store }) {
    store.dispatch(setRole('user'));
    return {
      title: 'Activities',
      component: <Layout><EditActivities /></Layout>,
    };
  },
};
