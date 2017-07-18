import React from 'react';
import ManageCampaignSettings from 'scenes/ManageCampaignSettings';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignSettingsWithAuthentication = withAuthentication(ManageCampaignSettings);

export default organizeCampaignPaths({
  path: '/organize/:slug/settings',
  component: campaign => (
    <Layout>
      <ManageCampaignSettingsWithAuthentication campaignSlug={campaign.slug} />
    </Layout>
  ),
});
