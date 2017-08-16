import React from 'react';
import ManageAction from 'scenes/ManageAction';
import Layout from 'components/Layout';

import organizeActionPaths from 'routes/organizeActionPaths';


const path = organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug',
  component: (campaign, action) => (
    <Layout>
      <ManageAction actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});

export default path;

