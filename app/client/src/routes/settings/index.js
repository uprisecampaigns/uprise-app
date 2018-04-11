/* eslint-disable global-require */

import React from 'react';
import Settings from 'scenes/Settings';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/settings',

  async action({ store, next }) {
    store.dispatch(setRole('volunteer'));

    const route = await next();
    return route;
  },

  children: [
    {
      path: '',
      action: () => ({
        title: 'Settings',
        component: <Layout><Settings /></Layout>,
      }),
    },
    require('./account').default,
    require('./contact').default,
    require('./privacySecurity').default,
    require('./confirmEmail').default,
    require('./editProfile').default,
  ],
};
