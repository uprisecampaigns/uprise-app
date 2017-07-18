import React from 'react';
import ManageActionProfile from 'scenes/ManageActionProfile';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionProfileWithAuthentication = withAuthentication(ManageActionProfile);

export default organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug/profile',
  component: (campaign, action) => (
    <Layout>
      <ManageActionProfileWithAuthentication actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
