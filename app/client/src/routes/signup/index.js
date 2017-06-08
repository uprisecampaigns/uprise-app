
import React from 'react';
import Layout from 'components/Layout';
import Signup from 'scenes/Signup';

export default {

  path: '/signup',

  async action() {
    const termsContent = await new Promise((resolve) => {
      require.ensure([], require => {
        resolve(require('content/terms.md'));
      }, 'terms');
    });

    return {
      title: 'Signup',
      component: <Layout><Signup termsContent={termsContent}/></Layout>,
    };
  },

};
