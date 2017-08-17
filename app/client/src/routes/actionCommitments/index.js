import React from 'react';
import ActionCommitments from 'scenes/ActionCommitments';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const ActionCommitmentsWithAuthentication = withAuthentication(ActionCommitments);

export default {

  path: '/volunteer/opportunity-commitments',

  action() {
    return {
      title: 'Opportunity Commitments',
      component: <Layout><ActionCommitmentsWithAuthentication /></Layout>,
    };
  },
};
