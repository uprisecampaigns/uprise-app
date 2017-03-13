import React from 'react';
import ManageCampaignProfile from './ManageCampaignProfile';
import Layout from 'components/Layout';

import history from 'lib/history';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignProfileWithAuthentication = withAuthentication(ManageCampaignProfile);

export default organizeCampaignPaths({
  path: '/organize/:slug/profile',
  component: (campaign) => (
    <Layout>
      <ManageCampaignProfileWithAuthentication campaign={campaign}/>
    </Layout>
  )
});
