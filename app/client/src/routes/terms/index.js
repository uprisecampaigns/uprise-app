import React from 'react';
import Page from 'components/Page';
import Layout from 'components/Layout';

export default {

  path: '/terms-and-conditions',

  async action() {
    const data = await import(/* webpackChunkName: "terms" */ 'content/terms.md');

    return {
      title: data.title,
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
