/* eslint-disable global-require */

import React from 'react';
import Account from 'scenes/Account';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {
  path: '/settings/account',

  async action({ store, next }) {
    store.dispatch(setRole('user'));

    const privacyContent = await import(/* webpackChunkName: "privacy" */ 'content/privacy.md');
    const termsContent = await import(/* webpackChunkName: "terms" */ 'content/terms.md');

    return {
      title: 'Account',
      component: (
        <Layout>
          <Account privacyContent={privacyContent} termsContent={termsContent} />
        </Layout>
      ),
    };
  },
};
