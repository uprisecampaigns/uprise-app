import React from 'react';
import CreateAction from 'scenes/CreateAction';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';

const CreateActionWithAuthentication = withAuthentication(CreateAction);

export default organizeCampaignPaths({
  path: '/organize/:slug/create-action',
  component: campaign => (
    <Layout>
      <CreateActionWithAuthentication campaignId={campaign.id} />
    </Layout>
  ),
});
