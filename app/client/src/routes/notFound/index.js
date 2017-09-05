import React from 'react';
import Home from 'scenes/Home';
import Layout from 'components/Layout';

import {
  addSearchItem, clearSearch,
} from 'actions/SearchActions';

export default {

  path: '*',

  action(context) {
    const tag = context.path.replace(/\//, '');
    context.store.dispatch(clearSearch('action'));
    context.store.dispatch(addSearchItem('action', 'keywords', tag));

    return {
      title: `${tag} Opportunities`,
      component: <Layout><Home /></Layout>,
    };
  },
};
