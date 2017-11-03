
import React from 'react';
import Layout from 'components/Layout';
import Signup from 'components/Signup';

export default {

  path: '/signup',

  async action() {
    const termsContent = await import(/* webpackChunkName: "terms" */ 'content/terms.md');

    return {
      title: 'Signup',
      component: <Layout><Signup termsContent={termsContent} /></Layout>,
    };
  },

};
