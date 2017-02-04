import React from 'react';
import Messages from './Messages';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const MessagesWithAuthentication = withAuthentication(Messages);

export default {

  path: '/communications/messages',

  action() {
    return {
      title: 'Messages',
      component: <Layout><MessagesWithAuthentication/></Layout>,
    };
  },

};
