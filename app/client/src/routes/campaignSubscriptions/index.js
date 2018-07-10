import React from 'react';
import CampaignSubscriptions from 'scenes/CampaignSubscriptions';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/volunteer/campaign-subscriptions',

  action({ store }) {
    store.dispatch(setRole('user'));
    return {
      title: 'My Subscriptions',
      component: <Layout><CampaignSubscriptions /></Layout>,
    };
  },
};
