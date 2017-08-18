import React from 'react';
import SearchActions from 'scenes/SearchActions';
import Layout from 'components/Layout';


export default {

  path: '/search/search-opportunities',

  action() {
    return {
      title: 'Search Opportunities',
      component: <Layout><SearchActions /></Layout>,
    };
  },
};
