import React from 'react';
import CreateAction from 'scenes/CreateAction';
import Layout from 'components/Layout';

import organizeCampaignPaths from 'routes/organizeCampaignPaths';


export default organizeCampaignPaths({
  path: '/:slug/create-role',
  component: campaign => (
    <Layout>
      <CreateAction campaignId={campaign.id} type="role" />
    </Layout>
  ),
});
