import React from 'react';
import CampaignSubscriptions from 'scenes/CampaignSubscriptions';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const CampaignSubscriptionsWithAuthentication = withAuthentication(CampaignSubscriptions);

export default {

  path: '/volunteer/campaign-subscriptions',

  action() {
    return {
      title: 'Campaign Subscriptions',
      component: <Layout><CampaignSubscriptionsWithAuthentication/></Layout>,
    };
  },
};
