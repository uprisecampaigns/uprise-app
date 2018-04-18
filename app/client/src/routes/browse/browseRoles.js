import React from 'react';
import BrowseRoles from 'scenes/BrowseRoles';
import Layout from 'components/Layout';

import { setBrowse } from 'actions/PageNavActions';

export default {

  path: '/roles',

  async action({ store }) {
    store.dispatch(setBrowse('roles'));

    return {
      title: 'Browse Roles',
      component: <Layout><BrowseRoles /></Layout>,
    };
  },
};
