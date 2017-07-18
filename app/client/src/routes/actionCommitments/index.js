import React from 'react';
import ActionCommitments from 'scenes/ActionCommitments';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const ActionCommitmentsWithAuthentication = withAuthentication(ActionCommitments);

export default {

  path: '/volunteer/action-commitments',

  action() {
    return {
      title: 'Action Commitments',
      component: <Layout><ActionCommitmentsWithAuthentication /></Layout>,
    };
  },
};
