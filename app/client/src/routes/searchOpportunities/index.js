import React from 'react';
import SearchOpportunities from './SearchOpportunities';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const SearchOpportunitiesWithAuthentication = withAuthentication(SearchOpportunities);

export default {

  path: '/search/search-opportunities',

  action() {
    return {
      title: 'Search Opportunities',
      component: <Layout><SearchOpportunitiesWithAuthentication/></Layout>,
    };
  },

};
