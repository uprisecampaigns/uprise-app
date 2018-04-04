/* eslint-disable global-require */

import React from 'react';
import BrowseHome from 'scenes/BrowseHome';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/browse',

  async action({ store, next }) {

    store.dispatch(setRole('volunteer'));

    const route = await next();
    return route;
  },

  children: [
    {
      path: '',
      action: () => ({
        title: 'Browse',
        component: <Layout><BrowseHome /></Layout>,
      }),
    },
    require('./browseEvents').default,
    require('./browseRoles').default,
    require('./browseCampaigns').default,
  ],
};
