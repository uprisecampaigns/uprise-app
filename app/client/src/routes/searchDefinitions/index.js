import React from 'react';
import Page from 'components/Page';
import Layout from 'components/Layout';


export default {

  path: '/help/search-definitions',

  async action() {
    const data = await import(/* webpackChunkName: "search-definitions" */ 'content/search-definitions.md');

    return {
      title: data.title,
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
