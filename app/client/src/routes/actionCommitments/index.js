import React from 'react';
import ActionCommitments from 'scenes/ActionCommitments';
import Layout from 'components/Layout';


export default {

  path: '/volunteer/action-commitments',

  action() {
    return {
      title: 'Action Commitments',
      component: <Layout><ActionCommitments /></Layout>,
    };
  },
};
