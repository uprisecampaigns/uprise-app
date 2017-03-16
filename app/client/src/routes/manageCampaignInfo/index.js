import React from 'react';
import ManageCampaignInfo from 'scenes/ManageCampaignInfo';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignInfoWithAuthentication = withAuthentication(ManageCampaignInfo);

export default organizeCampaignPaths({
  path: '/organize/:slug/info',
  component: (campaign) => (
    <Layout>
      <ManageCampaignInfoWithAuthentication campaignSlug={campaign.slug}/>
    </Layout>
  )
});
