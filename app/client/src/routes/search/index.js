import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/search',

  action(context) {
    context.store.dispatch(setPage('action'));
    return {
      title: 'Search for Volunteer Opportunities',
      component: <Layout><Home /></Layout>,
    };
  },
};
