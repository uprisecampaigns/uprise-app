import React from 'react';
import Volunteer from 'scenes/Volunteer';
import Layout from 'components/Layout';


export default {

  path: '/volunteer',

  action() {
    return {
      title: 'Volunteer',
      component: <Layout><Volunteer /></Layout>,
    };
  },
};
