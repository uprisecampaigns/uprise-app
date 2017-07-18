import React from 'react';
import Page from 'components/Page';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const PageWithAuthentication = withAuthentication(Page);

export default {

  path: '/help/search-definitions',

  async action() {
    const data = await new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require('content/search-definitions.md'));
      }, 'search-definitions');
    });

    return {
      title: data.title,
      component: <Layout><Page {...data} /></Layout>,
    };
  },

};
