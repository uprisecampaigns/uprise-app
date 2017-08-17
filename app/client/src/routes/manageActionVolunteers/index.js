import React from 'react';
import ManageActionVolunteers from 'scenes/ManageActionVolunteers';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionVolunteersWithAuthentication = withAuthentication(ManageActionVolunteers);

const path = organizeActionPaths({
  path: '/organize/:campaignSlug/opportunity/:actionSlug/volunteers',
  component: (campaign, action) => (
    <Layout>
      <ManageActionVolunteersWithAuthentication actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});

export default path;

