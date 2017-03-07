import React from 'react';
import SearchCampaigns from './SearchCampaigns';
import Layout from 'components/Layout';

import { 
  sortBy
} from 'actions/SearchActions';

import withAuthentication from 'routes/withAuthentication';

const SearchCampaignsWithAuthentication = withAuthentication(SearchCampaigns);

export default {

  path: '/search/search-campaigns',

  action(context) {

    context.store.dispatch(sortBy('campaign', 'title'));

    return {
      title: 'Search Campaigns',
      component: <Layout><SearchCampaignsWithAuthentication/></Layout>,
    };
  },

};
