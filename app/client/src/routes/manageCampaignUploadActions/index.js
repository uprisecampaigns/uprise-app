import React from 'react';
import ManageCampaignUploadActions from 'scenes/ManageCampaignUploadActions';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignUploadActionsWithAuthentication = withAuthentication(ManageCampaignUploadActions);

export default organizeCampaignPaths({
  path: '/organize/:slug/upload-actions',
  component: (campaign) => (
    <Layout>
      <ManageCampaignUploadActionsWithAuthentication campaignSlug={campaign.slug}/>
    </Layout>
  )
});
