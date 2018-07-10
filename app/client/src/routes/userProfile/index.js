import React from 'react';
import UserProfile from 'scenes/UserProfile';
import Layout from 'components/Layout';

import UserQuery from 'schemas/queries/UserQuery.graphql';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/user/:id',

  async action(context) {
    context.store.dispatch(setRole('user'));
    try {
      const { id } = context.params;
      const result = await context.apolloClient.query({
        query: UserQuery,
        variables: {
          search: { id },
        },
      });

      if (result.data.user) {
        return {
          title: `${result.data.user.first_name} ${result.data.user.last_name}`,
          image: result.data.user.profile_image_url,
          component: (
            <Layout>
              <UserProfile userId={id} />
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
