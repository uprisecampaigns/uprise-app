import React from 'react';
import ManageCampaignVolunteers from 'scenes/ManageCampaignVolunteers';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


export default organizeCampaignPaths({
  path: '/organize/:slug/volunteers',
  component: campaign => (
    <Layout>
      <ManageCampaignVolunteers campaignId={campaign.id} />
    </Layout>
  ),
});
