import React from 'react';
import SearchActions from 'scenes/SearchActions';
import Layout from 'components/Layout';


export default {

  path: '/search/search-actions',

  action() {
    return {
      title: 'Search Actions',
      component: <Layout><SearchActions /></Layout>,
    };
  },
};
