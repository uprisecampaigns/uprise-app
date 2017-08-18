import React from 'react';
import CampaignSubscriptions from 'scenes/CampaignSubscriptions';
import Layout from 'components/Layout';


export default {

  path: '/volunteer/campaign-subscriptions',

  action() {
    return {
      title: 'My Subscriptions',
      component: <Layout><CampaignSubscriptions /></Layout>,
    };
  },
};
