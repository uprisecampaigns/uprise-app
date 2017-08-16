import React from 'react';
import ManageActionVolunteers from 'scenes/ManageActionVolunteers';
import Layout from 'components/Layout';

import organizeActionPaths from 'routes/organizeActionPaths';


const path = organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug/volunteers',
  component: (campaign, action) => (
    <Layout>
      <ManageActionVolunteers actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});

export default path;

