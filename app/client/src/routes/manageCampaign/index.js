import React from 'react';
import ManageCampaign from './ManageCampaign';
import Layout from 'components/Layout';
import { graphql, compose } from 'react-apollo';

import withAuthentication from 'routes/withAuthentication';
import organizeCampaignPaths from 'routes/organizeCampaignPaths';

import { 
  MyCampaignsQuery, CampaignQuery
} from 'schemas/queries';


const ManageCampaignWithAuthentication = withAuthentication(ManageCampaign);

const path = organizeCampaignPaths({
  path: '/organize/:slug',
  component: (campaign) => (
    <Layout>
      <ManageCampaignWithAuthentication campaign={campaign}/>
    </Layout>
  )
});

export default path;

