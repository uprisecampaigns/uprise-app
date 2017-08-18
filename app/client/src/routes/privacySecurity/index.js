import React from 'react';
import PrivacySecurity from 'scenes/PrivacySecurity';
import Layout from 'components/Layout';


export default {

  path: '/settings/privacy-security',

  async action() {
    const privacyContent = await new Promise((resolve) => {
      require.ensure([], (require) => {
        resolve(require('content/privacy.md'));
      }, 'privacy');
    });

    return {
      title: 'Privacy and Security',
      component: <Layout><PrivacySecurity privacyContent={privacyContent} /></Layout>,
    };
  },
};
