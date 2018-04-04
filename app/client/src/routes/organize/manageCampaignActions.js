import React from 'react';
import ManageCampaignActions from 'scenes/ManageCampaignActions';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


export default organizeCampaignPaths({
  path: '/:slug/opportunities',
  component: campaign => (
    <Layout>
      <ManageCampaignActions campaignId={campaign.id} />
    </Layout>
  ),
});
