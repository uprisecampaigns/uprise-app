
import React from 'react';
import Layout from 'components/Layout';
import Signup from 'scenes/Signup';

export default {

  path: '/signup',

  async action() {
    return {
      title: 'Signup',
      component: <Layout><Signup/></Layout>,
    };
  },

};
