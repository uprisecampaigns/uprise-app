import React from 'react';
import Layout from 'components/Layout';
import Login from 'components/Login';


export default {

  path: '/login',

  async action(context) {
    return {
      title: 'Login',
      component: <Layout><Login /></Layout>,
    };
  },
};
