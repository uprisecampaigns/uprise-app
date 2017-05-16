import React from 'react';
import Campaign from 'scenes/Campaign';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

import { CampaignQuery } from 'schemas/queries';

const CampaignWithAuthentication = withAuthentication(Campaign);

export default {

  path: '/campaign/:slug',

  async action(context) {
    try {
      const { slug } = context.params;
      const result = await context.apolloClient.query({
        query: CampaignQuery,
        variables: {
          search: { slug }
        }
      });

      if (result.data.campaign) {
        return {
          title: result.data.campaign.title,
          component: (
            <Layout>
              <CampaignWithAuthentication campaignSlug={slug} campaignId={result.data.campaign.id}/>
            </Layout>
          ),
        };
      } else {
        return {
          redirect: '/search/search-campaigns'
        }
      }
    } catch (e) {
      console.error(e);
      return {
        redirect: '/search/search-campaigns'
      }
    }
  },
};
