import React from 'react';
import ActionCommitments from 'scenes/ActionCommitments';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/volunteer/opportunity-commitments',

  action({ store }) {
    store.dispatch(setRole('user'));
    return {
      title: 'Opportunity Commitments',
      component: <Layout><ActionCommitments /></Layout>,
    };
  },
};
