import React from 'react';
import Layout from 'components/Layout';
import HomeWrapper from './HomeWrapper';


export default {

  path: '',

  async action(context) {
    return {
      title: 'UpRise App Home',
      component: <Layout><HomeWrapper /></Layout>,
    };
  },

};
