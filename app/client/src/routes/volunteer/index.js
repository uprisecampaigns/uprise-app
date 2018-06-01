import React from 'react';
import Volunteer from 'scenes/Volunteer';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/volunteer',

  action({ store }) {
    store.dispatch(setRole('user'));

    return {
      title: 'Volunteer',
      component: <Layout><Volunteer /></Layout>,
    };
  },
};
