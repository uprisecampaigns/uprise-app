import React from 'react';
import Layout from 'components/Layout';
import Page from 'components/Page';

export default {

  path: '/about',

  async action() {
    const data = await new Promise((resolve) => {
      require.ensure([], require => {
        resolve(require('./about.md'));
      }, 'about');
    });

    return {
      title: data.title,
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
