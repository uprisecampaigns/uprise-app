import React from 'react';
import ManageCampaignComposeMessage from 'scenes/ManageCampaignComposeMessage';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignComposeMessageWithAuthentication = withAuthentication(ManageCampaignComposeMessage);

export default organizeCampaignPaths({
  path: '/organize/:slug/compose',
  component: (campaign) => (
    <Layout>
      <ManageCampaignComposeMessageWithAuthentication campaignId={campaign.id}/>
    </Layout>
  )
});
