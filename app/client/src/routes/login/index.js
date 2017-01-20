
import React from 'react';
import Login from './Login';

export default {

  path: '/login',

  async action(context) {
    return {
      title: 'Login',
      component: <Login/>,
    };
  },
};
