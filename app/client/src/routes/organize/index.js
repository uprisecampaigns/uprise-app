/* eslint-disable global-require */

import React from 'react';
import Organize from 'scenes/Organize';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/organize',

  async action({ store, next }) {
    store.dispatch(setRole('organize'));

    const route = await next();
    return route;
  },

  children: [
    {
      path: '',
      action: () => ({
      title: 'Organize',
      component: <Layout><Organize /></Layout>,
      }),
  },


  ],
};
