import React from 'react';
import ViewCalendar from './ViewCalendar';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const ViewCalendarWithAuthentication = withAuthentication(ViewCalendar);

export default {

  path: '/calendar/view-calendar',

  action() {
    return {
      title: 'View Calendar',
      component: <Layout><ViewCalendarWithAuthentication/></Layout>,
    };
  },

};
