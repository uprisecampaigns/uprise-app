import React from 'react';
import ManageCampaign from 'scenes/ManageCampaign';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const path = organizeCampaignPaths({
  path: '/organize/:slug',
  component: campaign => (
    <Layout>
      <ManageCampaign campaignSlug={campaign.slug} />
    </Layout>
  ),
});

export default path;

