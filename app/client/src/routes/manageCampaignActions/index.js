import React from 'react';
import ManageCampaignActions from 'scenes/ManageCampaignActions';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignActionsWithAuthentication = withAuthentication(ManageCampaignActions);

export default organizeCampaignPaths({
  path: '/organize/:slug/actions',
  component: (campaign) => (
    <Layout>
      <ManageCampaignActionsWithAuthentication campaignSlug={campaign.slug}/>
    </Layout>
  )
});
