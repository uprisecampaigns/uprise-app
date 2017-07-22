import React from 'react';
import ManageAction from 'scenes/ManageAction';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionWithAuthentication = withAuthentication(ManageAction);

const path = organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug',
  component: (campaign, action) => (
    <Layout>
      <ManageActionWithAuthentication actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});

export default path;

