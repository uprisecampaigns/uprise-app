import React from 'react';
import Settings from 'scenes/Settings';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/settings',

  action({store}) {
    store.dispatch(setRole('user'));
    return {
      title: 'Settings',
      component: <Layout><Settings /></Layout>,
    };
  },
};
