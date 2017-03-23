import React from 'react';
import ManageCampaignActionsList from 'scenes/ManageCampaignActionsList';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignActionsListWithAuthentication = withAuthentication(ManageCampaignActionsList);

export default organizeCampaignPaths({
  path: '/organize/:slug/actions-list',
  component: (campaign) => (
    <Layout>
      <ManageCampaignActionsListWithAuthentication campaignId={campaign.id}/>
    </Layout>
  )
});
