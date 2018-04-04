import React from 'react';
import Layout from 'components/Layout';
import SearchUsers from 'components/SearchUsers';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/search/search-volunteers',

  action(context) {
    return {
      title: 'Search for UpRise Volunteers',
      component: <Layout><SearchUsers /></Layout>,
    };
  },
};
