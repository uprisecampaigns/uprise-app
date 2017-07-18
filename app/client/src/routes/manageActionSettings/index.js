import React from 'react';
import ManageActionSettings from 'scenes/ManageActionSettings';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionSettingsWithAuthentication = withAuthentication(ManageActionSettings);

export default organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug/settings',
  component: (campaign, action) => (
    <Layout>
      <ManageActionSettingsWithAuthentication actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
