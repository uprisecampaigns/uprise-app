
import React from 'react';
import Layout from 'components/Layout';
import Home from 'scenes/Home';

export default {

  path: '/',

  async action() {
    return {
      title: 'UpRise App Home',
      component: <Layout><Home title="UpRise app home"/></Layout>,
    };
  },

};
