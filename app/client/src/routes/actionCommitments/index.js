import React from 'react';
import ActionCommitments from 'scenes/ActionCommitments';
import Layout from 'components/Layout';

import { setPage } from 'actions/PageNavActions';

export default {
  path: '/volunteer/opportunity-commitments',

  action({ store }) {
    store.dispatch(setPage('action'));
    return {
      title: 'Opportunity Commitments',
      component: (
        <Layout>
          <ActionCommitments />
        </Layout>
      ),
    };
  },
};
