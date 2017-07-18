import React from 'react';
import CreateCampaign from 'scenes/CreateCampaign';
import Layout from 'components/Layout';

import withAuthentication from 'routes/withAuthentication';

const CreateCampaignWithAuthentication = withAuthentication(CreateCampaign);

export default {

  path: '/organize/create-campaign',

  action() {
    return {
      title: 'View Calendar',
      component: <Layout><CreateCampaignWithAuthentication /></Layout>,
    };
  },

};
