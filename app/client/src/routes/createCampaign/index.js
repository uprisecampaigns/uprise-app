import React from 'react';
import CreateCampaign from 'scenes/CreateCampaign';
import Layout from 'components/Layout';


export default {

  path: '/organize/create-campaign',

  action() {
    return {
      title: 'Create Campaign',
      component: <Layout><CreateCampaign /></Layout>,
    };
  },

};
