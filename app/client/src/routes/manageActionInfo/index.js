import React from 'react';
import ManageActionInfo from 'scenes/ManageActionInfo';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';
import organizeActionPaths from 'routes/organizeActionPaths';


const ManageActionInfoWithAuthentication = withAuthentication(ManageActionInfo);

export default organizeActionPaths({
  path: '/organize/:campaignSlug/action/:actionSlug/info',
  component: (campaign, action) => (
    <Layout>
      <ManageActionInfoWithAuthentication actionId={action.id} campaignId={campaign.id}/>
    </Layout>
  )
});
