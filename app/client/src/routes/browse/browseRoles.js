import React from 'react';
import BrowseRoles from 'scenes/BrowseRoles';
import Layout from 'components/Layout';

export default {

  path: '/roles',

  action() {
    return {
      title: 'Browse Roles',
      component: <Layout><BrowseRoles /></Layout>,
    };
  },
}
