import React from 'react';
import Layout from 'components/Layout';
import HomeWrapper from 'components/HomeWrapper';


export default {

  path: '',

  async action(context) {
    return {
      title: 'Your Home for Progressive Volunteering',
      component: <Layout><HomeWrapper /></Layout>,
    };
  },

};
