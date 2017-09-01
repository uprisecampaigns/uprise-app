import React from 'react';
import SearchCampaigns from 'scenes/SearchCampaigns';
import Layout from 'components/Layout';


export default {
  path: '/search/search-campaigns',

  action(context) {
    return {
      title: 'Search Campaigns',
      component: <Layout><SearchCampaigns /></Layout>,
    };
  },
};
