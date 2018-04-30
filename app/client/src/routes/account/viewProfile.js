import React from 'react';
import ViewUserProfile from 'scenes/ViewUserProfile';
import Layout from 'components/Layout';


export default {

  path: '/view-profile',

  action() {
    return {
      title: 'View Profile',
      component: <Layout><ViewUserProfile isUser /></Layout>,
    };
  },
};
