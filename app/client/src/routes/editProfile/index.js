import React from 'react';
import EditUserProfile from 'scenes/EditUserProfile';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/settings/edit-profile',

  action({ store }) {
    store.dispatch(setRole('user'));
    return {
      title: 'Edit Profile',
      component: <Layout><EditUserProfile /></Layout>,
    };
  },
};
