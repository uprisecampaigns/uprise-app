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
        const { campaign } = result.data;
        return {
          title: campaign.title,
          image: typeof campaign.profile_image_url === 'string' ? campaign.profile_image_url : '',
          component: (
            <Layout>
              <Campaign campaignSlug={slug} campaignId={result.data.campaign.id} />
            </Layout>
          ),
        };
      }
      return {
        redirect: '/browse/campaigns',
      };
    } catch (e) {
      console.error(e);
      return {
        redirect: '/browse/campaigns',
      };
    }
  },
};
