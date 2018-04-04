import React from 'react';
import ManageActionComposeMessage from 'scenes/ManageActionComposeMessage';
import Layout from 'components/Layout';

import organizeActionPaths from 'routes/organizeActionPaths';


export default organizeActionPaths({
  path: '/:campaignSlug/opportunity/:actionSlug/compose',
  component: (campaign, action) => (
    <Layout>
      <ManageActionComposeMessage actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
