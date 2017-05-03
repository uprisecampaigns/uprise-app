import React from 'react';
import Contact from 'scenes/Contact';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const ContactWithAuthentication = withAuthentication(Contact);

export default {

  path: '/settings/contact',

  action() {
    return {
      title: 'Contact',
      component: <Layout><ContactWithAuthentication/></Layout>,
    };
  },
};
