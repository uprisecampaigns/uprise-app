/* eslint-disable global-require */

import React from 'react';
import Settings from 'scenes/Settings';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/account',

  async action({ store, next }) {
    store.dispatch(setRole('user'));

    const route = await next();
    return route;
  },

  children: [
    {
      path: '',
      action: () => ({
        title: 'Account',
        component: <Layout><Settings /></Layout>,
      }),
    },
    require('./settings').default,
    require('./contact').default,
    require('./privacySecurity').default,
    require('./confirmEmail').default,
    require('./editProfile').default,
  ],
};
