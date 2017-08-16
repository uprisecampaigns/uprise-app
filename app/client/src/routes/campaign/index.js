import React from 'react';
import Campaign from 'scenes/Campaign';
import Layout from 'components/Layout';

import CampaignQuery from 'schemas/queries/CampaignQuery.graphql';


export default {

  path: '/campaign/:slug',

  async action(context) {
    try {
      const { slug } = context.params;
      const result = await context.apolloClient.query({
        query: CampaignQuery,
        variables: {
          search: { slug },
        },
      });

      if (result.data.campaign) {
        return {
          title: result.data.campaign.title,
          component: (
            <Layout>
              <Campaign campaignSlug={slug} campaignId={result.data.campaign.id} />
            </Layout>
          ),
        };
      }
      return {
        redirect: '/search/search-campaigns',
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: '/search/search-campaigns',
      };
    }
  },
};
