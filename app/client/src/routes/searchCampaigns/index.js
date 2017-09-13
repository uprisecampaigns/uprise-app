import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';


export default {
  path: '/search/search-campaigns',

  action() {
    return {
      title: 'Search Campaigns',
      component: <Layout><Home startTab={1} /></Layout>,
    };
  },
};
