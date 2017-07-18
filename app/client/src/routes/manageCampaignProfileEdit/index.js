import React from 'react';
import ManageCampaignProfileEdit from 'scenes/ManageCampaignProfileEdit';
import Layout from 'components/Layout';

import history from 'lib/history';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignProfileEditWithAuthentication = withAuthentication(ManageCampaignProfileEdit);

export default organizeCampaignPaths({
  path: '/organize/:slug/profile/edit',
  component: campaign => (
    <Layout>
      <ManageCampaignProfileEditWithAuthentication campaignSlug={campaign.slug} />
    </Layout>
  ),
});
