
import React from 'react';
import ForgotPassword from './ForgotPassword';

export default {

  path: '/forgot-password',

  action(context) {
    return {
      title: 'Forgot Password',
      component: <ForgotPassword/>,
    };
  },
};
