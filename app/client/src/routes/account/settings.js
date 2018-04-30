import React from 'react';
import AccountSettings from 'scenes/AccountSettings';
import Layout from 'components/Layout';


export default {

  path: '/settings',

  action() {
    return {
      title: 'Account Settings',
      component: <Layout><AccountSettings /></Layout>,
    };
  },
};
