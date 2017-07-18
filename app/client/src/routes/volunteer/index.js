import React from 'react';
import Volunteer from 'scenes/Volunteer';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const VolunteerWithAuthentication = withAuthentication(Volunteer);

export default {

  path: '/volunteer',

  action() {
    return {
      title: 'Volunteer',
      component: <Layout><VolunteerWithAuthentication /></Layout>,
    };
  },
};
