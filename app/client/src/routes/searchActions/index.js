import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';


export default {
  path: '/search/search-opportunities',

  action() {
    return {
      title: 'Search Opportunities',
      component: <Layout><Home startTab={0} /></Layout>,
    };
  },
};
