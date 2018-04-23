import React from 'react';
import Account from 'scenes/Account';
import Layout from 'components/Layout';


export default {

  path: '/settings',

  action() {
    return {
      title: 'Account',
      component: <Layout><Account /></Layout>,
    };
  },
};
