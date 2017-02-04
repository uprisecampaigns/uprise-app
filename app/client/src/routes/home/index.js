
import React from 'react';
import Layout from 'components/Layout';
import Home from './Home';

export default {

  path: '/',

  async action() {
    return {
      title: 'Uprise App Home',
      component: <Layout><Home title="Uprise app home"/></Layout>,
    };
  },

};
