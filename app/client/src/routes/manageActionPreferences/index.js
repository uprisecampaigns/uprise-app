import React from 'react';
import ManageActionPreferences from 'scenes/ManageActionPreferences';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionPreferencesWithAuthentication = withAuthentication(ManageActionPreferences);

export default organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug/preferences',
  component: (campaign, action) => (
    <Layout>
      <ManageActionPreferencesWithAuthentication actionId={action.id} campaignId={campaign.id} />
    </Layout>
  ),
});
