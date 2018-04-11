import React from 'react';
import HomeWrapper from 'components/HomeWrapper';
import Layout from 'components/Layout';

import {
  addSearchItem, clearSearch,
} from 'actions/SearchActions';

export default {

  path: '(.*)',

  action(context) {
    const tag = context.path.replace(/\//, '');
    context.store.dispatch(clearSearch('action'));
    context.store.dispatch(addSearchItem('action', 'tags', tag));

    return {
      title: `${tag} Opportunities`,
      component: <Layout><HomeWrapper /></Layout>,
    };
  },
};
