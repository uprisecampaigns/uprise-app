import React from 'react';
import ManageCampaignComposeMessage from 'scenes/ManageCampaignComposeMessage';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


export default organizeCampaignPaths({
  path: '/:slug/compose',
  component: campaign => (
    <Layout>
      <ManageCampaignComposeMessage campaignId={campaign.id} />
    </Layout>
  ),
});
