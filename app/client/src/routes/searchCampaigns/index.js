import React from 'react';
import SearchCampaigns from 'scenes/SearchCampaigns';
import Layout from 'components/Layout';

import {
  sortBy,
} from 'actions/SearchActions';


export default {

  path: '/search/search-campaigns',

  action(context) {
    context.store.dispatch(sortBy('campaign', 'title'));

    return {
      title: 'Search Campaigns',
      component: <Layout><SearchCampaigns /></Layout>,
    };
  },

};
