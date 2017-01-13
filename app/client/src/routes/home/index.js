
import React from 'react';
import Home from './Home';
import Layout from '../../components/Layout';

export default {

  path: '/',

  async action() {
    return {
      title: 'Uprise App Home',
      component: <Layout><Home title="Uprise app home"/></Layout>,
    };
  },

};
