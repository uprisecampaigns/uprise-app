import React from 'react';
import Layout from 'components/Layout';
import Search from 'scenes/Search';


export default {
  path: '/search',

  action() {
    return {
      title: 'Search',
      component: <Layout><Search /></Layout>,
    };
  },
};
