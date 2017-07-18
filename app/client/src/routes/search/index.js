import React from 'react';
import Layout from 'components/Layout';
import Search from 'scenes/Search';

import withAuthentication from 'routes/withAuthentication';

const SearchWithAuthentication = withAuthentication(Search);

export default {
  path: '/search',

  action() {
    return {
      title: 'Search',
      component: <Layout><SearchWithAuthentication /></Layout>,
    };
  },
};
