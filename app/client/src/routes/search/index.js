import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';


export default {
  path: '/search',

  action() {
    return {
      title: 'Search for Volunteer Opportunities',
      component: <Layout><Home /></Layout>,
    };
  },
};
