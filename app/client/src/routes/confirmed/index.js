import React from 'react';
import Layout from 'components/Layout';
import Confirmed from 'scenes/Confirmed';

export default {
  path: '/confirmed',

  action(context) {
    return {
      title: 'Welcome to UpRise',
      component: <Layout><Confirmed /></Layout>,
    };
  },
};
