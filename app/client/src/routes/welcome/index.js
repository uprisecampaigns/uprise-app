import React from 'react';
import Page from 'components/Page';
import Layout from 'components/Layout';


export default {

  path: '/welcome',

  async action() {
    const data = await import(/* webpackChunkName: "welcome" */ 'content/welcome.md');

    return {
      title: data.title,
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
