import React from 'react';
import ManageCampaignLocation from './ManageCampaignLocation';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignLocationWithAuthentication = withAuthentication(ManageCampaignLocation);

export default organizeCampaignPaths({
  path: '/organize/:slug/location',
  component: (campaign) => (
    <Layout>
      <ManageCampaignLocationWithAuthentication campaign={campaign}/>
    </Layout>
  )
});
