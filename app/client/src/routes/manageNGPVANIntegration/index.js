import React from 'react';
import ManageNGPVANIntegration from 'scenes/ManageNGPVANIntegration';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';

export default organizeCampaignPaths({
  path: '/organize/:slug/ngpvan',
  component: (campaign) => (
    <Layout>
      <ManageNGPVANIntegration campaignId={campaign.id} />
    </Layout>
  ),
});
