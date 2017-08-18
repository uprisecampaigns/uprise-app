import React from 'react';
import Settings from 'scenes/Settings';
import Layout from 'components/Layout';


export default {

  path: '/settings',

  action() {
    return {
      title: 'Settings',
      component: <Layout><Settings /></Layout>,
    };
  },
};
