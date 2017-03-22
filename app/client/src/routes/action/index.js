import React from 'react';
import Action from 'scenes/Action';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

import { ActionQuery } from 'schemas/queries';

const ActionWithAuthentication = withAuthentication(Action);

export default {

  path: '/action/:slug',

  async action(context) {

    const result = await context.apolloClient.query({
      query: ActionQuery,
      variables: {
        search: {
          slug: context.params.slug
        }
      }
    });

    if (result.data.action) {
      return {
        title: result.data.action.title,
        component: (
          <Layout>
            <ActionWithAuthentication actionId={result.data.action.id}/>
          </Layout>
        ),
      };
    } else {
      return {
        redirect: '/search/search-actions'
      }
    }
  },

};
