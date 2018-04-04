import React from 'react';
import Layout from 'components/Layout';
import SearchActions from 'components/SearchActions';

import { setRole } from 'actions/PageNavActions';

export default {
  path: '/search/search-opportunities',

  action(context) {

    context.store.dispatch(setRole('volunteer'));

    return {
      title: 'Search for Volunteer Opportunities',
      component: <Layout><SearchActions /></Layout>,
    };
  },
};
