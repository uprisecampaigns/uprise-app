import React from 'react';
import SearchActions from 'scenes/SearchActions';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const SearchActionsWithAuthentication = withAuthentication(SearchActions);

export default {

  path: '/search/search-actions',

  action() {
    return {
      title: 'Search Actions',
      component: <Layout><SearchActionsWithAuthentication/></Layout>,
    };
  },
};
