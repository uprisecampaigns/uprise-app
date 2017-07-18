import React from 'react';
import ManageCampaignVolunteers from 'scenes/ManageCampaignVolunteers';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignVolunteersWithAuthentication = withAuthentication(ManageCampaignVolunteers);

export default organizeCampaignPaths({
  path: '/organize/:slug/volunteers',
  component: campaign => (
    <Layout>
      <ManageCampaignVolunteersWithAuthentication campaignId={campaign.id} />
    </Layout>
  ),
});
