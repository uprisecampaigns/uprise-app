
import React from 'react';
import Signup from './Signup';

export default {

  path: '/signup',

  async action() {
    return {
      title: 'Signup',
      component: <Signup/>,
    };
  },

};
