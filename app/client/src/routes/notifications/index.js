import React from 'react';
import Notifications from './Notifications';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const NotificationsWithAuthentication = withAuthentication(Notifications);

export default {

  path: '/communications/notifications',

  action() {
    return {
      title: 'Notifications',
      component: <Layout><NotificationsWithAuthentication/></Layout>,
    };
  },

};
