import React from 'react';
import Layout from 'components/Layout';
import HomeWrapper from './HomeWrapper';


export default {

  path: '/',

  async action(context) {

    const data = await new Promise((resolve) => {
      require.ensure([], require => {
        resolve(require('content/welcome.md'));
      }, 'welcome');
    });

    return {
      title: 'UpRise App Home',
      component: <Layout><HomeWrapper title="UpRise app home" {...data}/></Layout>,
    };
  },

};
