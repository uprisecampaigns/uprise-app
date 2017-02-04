
import React from 'react';
import Layout from 'components/Layout';
import ForgotPassword from './ForgotPassword';

export default {

  path: '/forgot-password',

  action(context) {
    return {
      title: 'Forgot Password',
      component: <Layout><ForgotPassword/></Layout>,
    };
  },
};
