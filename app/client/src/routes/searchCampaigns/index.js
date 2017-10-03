import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/search/search-campaigns',

  action(context) {
    context.store.dispatch(setPage('home', 'campaigns'));

    return {
      title: 'Search Campaigns',
      component: <Layout><Home startTab={1} /></Layout>,
    };
  },
};
