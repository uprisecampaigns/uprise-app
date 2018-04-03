import React from 'react';
import Layout from 'components/Layout';
import SearchCampaigns from 'components/SearchCampaigns';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/search/search-campaigns',

  action(context) {
    context.store.dispatch(setPage('home', 'campaign'));

    return {
      title: 'Search for Campaigns with Volunteer Opportunities',
      component: <Layout><SearchCampaigns /></Layout>,
    };
  },
};
