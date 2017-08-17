import React from 'react';
import ManageActionComposeMessage from 'scenes/ManageActionComposeMessage';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionComposeMessageWithAuthentication = withAuthentication(ManageActionComposeMessage);

export default organizeActionPaths({
  path: '/organize/:campaignSlug/opportunity/:actionSlug/compose',
  component: (campaign, action) => (
    <Layout>
      <ManageActionComposeMessageWithAuthentication actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
