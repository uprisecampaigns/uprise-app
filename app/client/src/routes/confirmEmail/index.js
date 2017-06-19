import React from 'react';
import Campaign from 'scenes/Campaign';
import Layout from 'components/Layout';
import Home from 'scenes/Home';

import ConfirmEmailMutation from 'schemas/mutations/ConfirmEmailMutation.graphql';

import {
  notify
} from 'actions/NotificationsActions';


export default {

  path: '/settings/confirm-email/:token',

  async action(context) {
    try {
      const { token } = context.params;
      const result = await context.apolloClient.mutate({
        mutation: ConfirmEmailMutation,
        variables: { token }
      });

      console.log(result);
      if (result.data.confirmEmail) {
        context.store.dispatch(notify('Email successfully confirmed'));
      } else {
        context.store.dispatch(notify('There was an error confirming your email. Please try again.'));
      }

    } catch (e) {
      console.error(e);
      context.store.dispatch(notify('There was an error confirming your email. Please try again.'));
    }

    return {
      redirect: '/'
    }
  },
};
