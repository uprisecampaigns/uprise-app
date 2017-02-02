import React from 'react';
import ChangePassword from './ChangePassword';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';


const ChangePasswordWithAuthentication = withAuthentication(ChangePassword);

export default {

  path: '/settings/change-password',

  action(context) {
    return {
      title: 'Change Password',
      component: <Layout><ChangePasswordWithAuthentication/></Layout>,
    };
  },
};
