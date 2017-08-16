import React from 'react';
import ManageActionSettings from 'scenes/ManageActionSettings';
import Layout from 'components/Layout';

import organizeActionPaths from 'routes/organizeActionPaths';


export default organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug/settings',
  component: (campaign, action) => (
    <Layout>
      <ManageActionSettings actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
