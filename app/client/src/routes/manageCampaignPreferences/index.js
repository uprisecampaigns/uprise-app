import React from 'react';
import ManageCampaignPreferences from './ManageCampaignPreferences';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignPreferencesWithAuthentication = withAuthentication(ManageCampaignPreferences);

export default organizeCampaignPaths({
  path: '/organize/:slug/preferences',
  component: (campaign) => (
    <Layout>
      <ManageCampaignPreferencesWithAuthentication campaign={campaign}/>
    </Layout>
  )
});
