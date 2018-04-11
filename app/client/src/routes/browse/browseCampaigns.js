import React from 'react';
import BrowseCampaigns from 'scenes/BrowseCampaigns';
import Layout from 'components/Layout';

export default {

  path: '/campaigns',

  action() {
    return {
      title: 'Browse Campaigns',
      component: <Layout><BrowseCampaigns /></Layout>,
    };
  },
};
