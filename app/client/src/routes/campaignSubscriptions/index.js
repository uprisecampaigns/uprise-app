import React from 'react';
import CampaignSubscriptions from 'scenes/CampaignSubscriptions';
import Layout from 'components/Layout';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/volunteer/campaign-subscriptions',

  action({ store }) {
    store.dispatch(setPage('action'));
    return {
      title: 'My Subscriptions',
      component: (
        <Layout>
          <CampaignSubscriptions />
        </Layout>
      ),
    };
  },
};
