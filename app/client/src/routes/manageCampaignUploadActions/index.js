import React from 'react';
import ManageCampaignUploadActions from 'scenes/ManageCampaignUploadActions';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


export default organizeCampaignPaths({
  path: '/organize/:slug/upload-actions',
  component: campaign => (
    <Layout>
      <ManageCampaignUploadActions campaignSlug={campaign.slug} />
    </Layout>
  ),
});
