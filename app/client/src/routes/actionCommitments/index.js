import React from 'react';
import ActionCommitments from 'scenes/ActionCommitments';
import Layout from 'components/Layout';


export default {

  path: '/volunteer/opportunity-commitments',

  action() {
    return {
      title: 'Opportunity Commitments',
      component: <Layout><ActionCommitments /></Layout>,
    };
  },
};
