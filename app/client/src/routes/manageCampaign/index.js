import React from 'react';
import ManageCampaign from 'scenes/ManageCampaign';
import Layout from 'components/Layout';
import { graphql, compose } from 'react-apollo';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';


const ManageCampaignWithAuthentication = withAuthentication(ManageCampaign);

const path = organizeCampaignPaths({
  path: '/organize/:slug',
  component: campaign => (
    <Layout>
      <ManageCampaignWithAuthentication campaignSlug={campaign.slug} />
    </Layout>
  ),
});

export default path;

