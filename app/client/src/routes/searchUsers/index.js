import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/search/search-volunteers',

  action(context) {
    context.store.dispatch(setPage('home', 'user'));

    return {
      title: 'Search for UpRise Volunteers',
      component: <Layout><Home startTab={1} /></Layout>,
    };
  },
};
