import React from 'react';
import ManageActionProfileEdit from 'scenes/ManageActionProfileEdit';
import Layout from 'components/Layout';

import organizeActionPaths from 'routes/organizeActionPaths';


export default organizeActionPaths({
  path: '/:campaignSlug/opportunity/:actionSlug/profile/edit',
  component: (campaign, action) => (
    <Layout>
      <ManageActionProfileEdit actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
