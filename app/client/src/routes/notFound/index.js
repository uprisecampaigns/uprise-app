import React from 'react';
import SearchActions from 'scenes/SearchActions';
import Layout from 'components/Layout';

import {
  addSearchItem, clearSearch,
} from 'actions/SearchActions';

export default {

  path: '*',

  action(context) {
    const tag = context.path.replace(/\//, '');
    context.store.dispatch(clearSearch('action'));
    context.store.dispatch(addSearchItem('action', 'tags', tag));

    return {
      title: `${tag} Opportunities`,
      component: <Layout><SearchActions /></Layout>,
    };
  },
};
