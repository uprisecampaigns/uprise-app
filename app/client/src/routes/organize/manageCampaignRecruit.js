import React from 'react';
import ManageCampaignRecruit from 'scenes/ManageCampaignRecruit';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const path = organizeCampaignPaths({
  path: '/:slug/recruit',
  component: campaign => (
    <Layout>
      <ManageCampaignRecruit campaignId={campaign.id} />
    </Layout>
  ),
});

export default path;
