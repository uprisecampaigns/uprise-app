import React from 'react';
import Campaign from './Campaign';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

import { CampaignQuery } from 'schemas/queries';

const CampaignWithAuthentication = withAuthentication(Campaign);

export default {

  path: '/campaign/:slug',

  async action(context) {

    const result = await context.apolloClient.query({
      query: CampaignQuery,
      variables: {
        search: {
          slug: context.params.slug
        }
      }
    });

    if (result.data.campaign) {
      return {
        title: result.data.campaign.title,
        component: (
          <Layout>
            <CampaignWithAuthentication campaign={result.data.campaign}/>
          </Layout>
        ),
      };
    } else {
      return {
        redirect: '/search/search-campaigns'
      }
    }
  },

};
