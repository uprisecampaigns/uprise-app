import React from 'react';
import Page from 'components/Page';
import Layout from 'components/Layout';


export default {

  path: '/welcome',

  async action() {
    const data = await new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require('content/welcome.md'));
      }, 'welcome');
    });

    return {
      title: data.title,
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
