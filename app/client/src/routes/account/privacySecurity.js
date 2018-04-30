import React from 'react';
import PrivacySecurity from 'components/PrivacySecurity';
import Layout from 'components/Layout';


export default {

  path: '/privacy-security',

  async action() {
    return {
      title: 'Privacy and Security',
      component: <Layout><PrivacySecurity /></Layout>,
    };
  },
};
