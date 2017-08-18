import React from 'react';
import Action from 'scenes/Action';
import Layout from 'components/Layout';

import ActionQuery from 'schemas/queries/ActionQuery.graphql';

export default {

  path: '/opportunity/:slug',

  async action(context) {
    try {
      const { slug } = context.params;
      const result = await context.apolloClient.query({
        query: ActionQuery,
        variables: {
          search: { slug },
        },
      });

      if (result.data.action) {
        return {
          title: result.data.action.title,
          component: (
            <Layout>
              <Action actionSlug={slug} actionId={result.data.action.id} />
            </Layout>
          ),
        };
      }
      return {
        redirect: '/search/search-opportunities',
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: '/search/search-opportunities',
      };
    }
  },
};
