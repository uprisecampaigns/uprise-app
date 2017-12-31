import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/search/search-users',

  action(context) {
    context.store.dispatch(setPage('home', 'users'));

    return {
      title: 'Search for UpRise Users',
      component: <Layout><Home startTab={1} /></Layout>,
    };
  },
};
