import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';


export default {
  path: '/search',

  action() {
    return {
      title: 'Search',
      component: <Layout><Home /></Layout>,
    };
  },
};
