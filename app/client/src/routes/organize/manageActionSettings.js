import React from 'react';
import ManageActionSettings from 'scenes/ManageActionSettings';
import Layout from 'components/Layout';

import organizeActionPaths from 'routes/organizeActionPaths';


export default organizeActionPaths({
  path: '/:campaignSlug/opportunity/:actionSlug/settings',
  component: (campaign, action) => (
    <Layout>
      <ManageActionSettings actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
