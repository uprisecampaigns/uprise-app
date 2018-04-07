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
        const { action } = result.data;
        return {
          title: action.title,
          image: typeof action.campaign === 'object' &&
            action.campaign !== null &&
            typeof action.campaign.profile_image_url === 'string' ? action.campaign.profile_image_url : '',
          component: (
            <Layout>
              <Action actionSlug={slug} actionId={result.data.action.id} />
            </Layout>
          ),
        };
      }
      return {
        redirect: '/browse',
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: '/browse',
      };
    }
  },
};
