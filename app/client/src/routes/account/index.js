import React from 'react';
import Account from 'scenes/Account';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const AccountWithAuthentication = withAuthentication(Account);

export default {

  path: '/settings/account',

  action() {
    return {
      title: 'Account',
      component: <Layout><AccountWithAuthentication/></Layout>,
    };
  },
};
