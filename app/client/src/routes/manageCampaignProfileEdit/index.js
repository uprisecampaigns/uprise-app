import React from 'react';
import ManageCampaignProfileEdit from 'scenes/ManageCampaignProfileEdit';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


export default organizeCampaignPaths({
  path: '/organize/:slug/profile/edit',
  component: campaign => (
    <Layout>
      <ManageCampaignProfileEdit campaignSlug={campaign.slug} />
    </Layout>
  ),
});
