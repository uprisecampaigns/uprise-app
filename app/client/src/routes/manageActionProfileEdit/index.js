import React from 'react';
import ManageActionProfileEdit from 'scenes/ManageActionProfileEdit';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionProfileEditWithAuthentication = withAuthentication(ManageActionProfileEdit);

export default organizeActionPaths({
  path: '/organize/:campaignSlug/opportunity/:actionSlug/profile/edit',
  component: (campaign, action) => (
    <Layout>
      <ManageActionProfileEditWithAuthentication actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
