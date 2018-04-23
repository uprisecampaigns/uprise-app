import React from 'react';
import EditUserProfile from 'scenes/EditUserProfile';
import Layout from 'components/Layout';


export default {

  path: '/edit-profile',

  action() {
    return {
      title: 'Edit Profile',
      component: <Layout><EditUserProfile /></Layout>,
    };
  },
};
