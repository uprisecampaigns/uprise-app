import React from 'react';
import BrowseEvents from 'scenes/BrowseEvents';
import Layout from 'components/Layout';

import { setBrowse } from 'actions/PageNavActions';

export default {

  path: '/events',

  async action({ store }) {
    store.dispatch(setBrowse('events'));

    return {
      title: 'Browse Events',
      component: <Layout><BrowseEvents /></Layout>,
    };
  },
};
