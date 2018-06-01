/* eslint-disable global-require */

import React from 'react';
import Account from 'scenes/Account';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/settings/account',

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
      component: <Layout><Account /></Layout>,
      }),
  },


  ],
};
