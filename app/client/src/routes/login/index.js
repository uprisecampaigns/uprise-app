
import React from 'react';
import Login from './Login';

export default {

  path: '/login',

  async action() {
    return {
      title: 'Login',
      component: <Login/>,
    };
  },

};
