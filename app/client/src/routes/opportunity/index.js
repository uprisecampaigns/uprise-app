import React from 'react';
import Opportunity from './Opportunity';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

import { OpportunityQuery } from 'schemas/queries';

const OpportunityWithAuthentication = withAuthentication(Opportunity);

export default {

  path: '/opportunity/:slug',

  async action(context) {

    const result = await context.apolloClient.query({
      query: OpportunityQuery,
      variables: {
        search: {
          slug: context.params.slug
        }
      }
    });

    if (result.data.opportunity) {
      return {
        title: result.data.opportunity.title,
        component: (
          <Layout>
            <OpportunityWithAuthentication opportunity={result.data.opportunity}/>
          </Layout>
        ),
      };
    } else {
      return {
        redirect: '/search/search-opportunities'
      }
    }
  },

};
