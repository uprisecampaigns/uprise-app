import React from 'react';
import SearchActions from 'scenes/SearchActions';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const SearchActionsWithAuthentication = withAuthentication(SearchActions);

export default {

  path: '/search/search-opportunities',

  action() {
    return {
      title: 'Search Opportunities',
      component: <Layout><SearchActionsWithAuthentication /></Layout>,
    };
  },
};
