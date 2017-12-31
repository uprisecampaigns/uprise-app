import React from 'react';
import MessageUser from 'scenes/MessageUser';
import Layout from 'components/Layout';

import { setRecipients } from 'actions/MessageActions';

import UserQuery from 'schemas/queries/UserQuery.graphql';

export default {

  path: '/user/:id/compose',

  async action(context) {
    try {
      const { id } = context.params;
      const result = await context.apolloClient.query({
        query: UserQuery,
        variables: {
          search: { id },
        },
      });

      if (result.data.user) {
        context.store.dispatch(setRecipients([result.data.user]));
        return {
          title: `Compose Message to ${result.data.user.first_name} ${result.data.user.last_name}`,
          component: (
            <Layout>
              <MessageUser />
            </Layout>
          ),
        };
      }
      return {
        redirect: '/',
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: '/',
      };
    }
  },
};
