/* eslint-disable global-require */

import React from 'react';
import Organize from 'scenes/Organize';
import Layout from 'components/Layout';

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/organize',

  async action({ store, next }) {
    store.dispatch(setRole('organizer'));

    const route = await next();
    return route;
  },

  children: [
    {
      path: '',
      action: () => ({
        title: 'Organize',
        component: <Layout><Organize /></Layout>,
      }),
    },
    require('./createCampaign').default,

    // /organize/:slug/
    require('./manageCampaign').default,
    require('./manageCampaignSettings').default,
    require('./manageCampaignVolunteers').default,
    require('./manageCampaignComposeMessage').default,
    require('./manageCampaignProfileEdit').default,
    require('./manageCampaignActions').default,
    require('./manageCampaignUploadActions').default,
    require('./createRole').default,
    require('./createEvent').default,

    // /organize/:campaignSlug/opportunity/:actionSlug
    require('./manageAction').default,
    require('./manageActionSettings').default,
    require('./manageActionVolunteers').default,
    require('./manageActionProfileEdit').default,
    require('./manageActionComposeMessage').default,

  ],
};
