import React from 'react';
import Organize from 'scenes/Organize';
import Layout from 'components/Layout';


export default {

  path: '/organize',

  action() {
    return {
      title: 'Organize',
      component: <Layout><Organize /></Layout>,
    };
  },

};
