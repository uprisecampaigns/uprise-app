import React from 'react';
import Page from 'components/Page';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const PageWithAuthentication = withAuthentication(Page);

export default {

  path: '/terms-and-conditions',

  async action() {
    const data = await new Promise((resolve) => {
      require.ensure([], require => {
        resolve(require('content/terms.md'));
      }, 'terms');
    });

    return {
      title: data.title,
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
