import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/search/search-opportunities',

  action(context) {
    context.store.dispatch(setPage('home', 'actions'));

    return {
      title: 'Search Opportunities',
      component: <Layout><Home startTab={0} /></Layout>,
    };
  },
};
