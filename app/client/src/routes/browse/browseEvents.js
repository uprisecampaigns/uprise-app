import React from 'react';
import BrowseEvents from 'scenes/BrowseEvents';
import Layout from 'components/Layout';

export default {

  path: '/events',

  action() {
    return {
      title: 'Browse Events',
      component: <Layout><BrowseEvents /></Layout>,
    };
  },
}
