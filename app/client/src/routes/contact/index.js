import React from 'react';
import Contact from 'scenes/Contact';
import Layout from 'components/Layout';


export default {

  path: '/settings/contact',

  action() {
    return {
      title: 'Contact',
      component: <Layout><Contact /></Layout>,
    };
  },
};
