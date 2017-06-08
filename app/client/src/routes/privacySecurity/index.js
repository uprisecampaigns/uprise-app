import React from 'react';
import PrivacySecurity from 'scenes/PrivacySecurity';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const PrivacySecurityWithAuthentication = withAuthentication(PrivacySecurity);

export default {

  path: '/settings/privacy-security',

  async action() {
    const privacyContent = await new Promise((resolve) => {
      require.ensure([], require => {
        resolve(require('content/privacy.md'));
      }, 'privacy');
    });

    return {
      title: 'Privacy and Security',
      component: <Layout><PrivacySecurityWithAuthentication privacyContent={privacyContent}/></Layout>,
    };
  },
};
