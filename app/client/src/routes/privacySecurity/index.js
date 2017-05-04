import React from 'react';
import PrivacySecurity from 'scenes/PrivacySecurity';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const PrivacySecurityWithAuthentication = withAuthentication(PrivacySecurity);

export default {

  path: '/settings/privacy-security',

  action() {
    return {
      title: 'Privacy and Security',
      component: <Layout><PrivacySecurityWithAuthentication/></Layout>,
    };
  },
};
