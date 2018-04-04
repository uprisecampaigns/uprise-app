import React from 'react';
import PrivacySecurity from 'scenes/PrivacySecurity';
import Layout from 'components/Layout';


export default {

  path: '/privacy-security',

  async action() {
    const privacyContent = await import(/* webpackChunkName: "privacy" */ 'content/privacy.md');

    return {
      title: 'Privacy and Security',
      component: <Layout><PrivacySecurity privacyContent={privacyContent} /></Layout>,
    };
  },
};
