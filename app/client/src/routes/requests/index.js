import React from 'react';
import Requests from 'scenes/Requests';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const RequestsWithAuthentication = withAuthentication(Requests);

export default {

  path: '/communications/requests',

  action() {
    return {
      title: 'Requests',
      component: <Layout><RequestsWithAuthentication/></Layout>,
    };
  },

};
