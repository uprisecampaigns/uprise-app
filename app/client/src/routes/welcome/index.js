import React from 'react';
import Layout from 'components/Layout';
import Welcome from 'scenes/Welcome';

export default {
  path: '/welcome',

  action(context) {
    return {
      title: 'Welcome to UpRise',
      component: <Layout><Welcome /></Layout>,
    };
  },
};
