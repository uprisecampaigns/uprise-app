import React from 'react';
import ManageCampaignSettings from 'scenes/ManageCampaignSettings';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


export default organizeCampaignPaths({
  path: '/organize/:slug/settings',
  component: campaign => (
    <Layout>
      <ManageCampaignSettings campaignSlug={campaign.slug} />
    </Layout>
  ),
});
