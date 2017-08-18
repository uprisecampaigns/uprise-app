import React from 'react';
import SearchActions from 'scenes/SearchActions';
import Layout from 'components/Layout';

import {
  addSearchItem,
} from 'actions/SearchActions';

export default {

  path: '*',

  action(context) {
    const tag = context.path.replace(/\//, '');
    context.store.dispatch(addSearchItem('action', 'keywords', tag));

    return {
      title: `${tag} Opportunities`,
      component: <Layout><SearchActions /></Layout>,
    };
  },
};
