/* eslint-disable global-require */

export default {

  path: '',

  // Routes are evaluated in order
  children: [
    require('./home').default,
    require('./about').default,
    require('./login').default,
    require('./signup').default,
    require('./forgotPassword').default,
    require('./welcome').default,
    require('./terms').default,

    // /settings/
    require('./settings').default,
    require('./account').default,
    require('./contact').default,
    require('./privacySecurity').default,
    require('./confirmEmail').default,

    // /organize/
    require('./organize').default,
    require('./createCampaign').default,

    // /organize/:slug/
    require('./manageCampaign').default,
    require('./manageCampaignSettings').default,
    require('./manageCampaignVolunteers').default,
    require('./manageCampaignComposeMessage').default,
    require('./manageCampaignProfileEdit').default,
    require('./manageCampaignActions').default,
    require('./manageCampaignUploadActions').default,
    require('./createAction').default,

    // /organize/:campaignSlug/opportunity/:actionSlug
    require('./manageAction').default,
    require('./manageActionSettings').default,
    require('./manageActionVolunteers').default,
    require('./manageActionProfileEdit').default,
    require('./manageActionComposeMessage').default,

    // /volunteer/
    require('./volunteer').default,
    require('./actionCommitments').default,
    require('./campaignSubscriptions').default,

    // /opportunity/
    require('./action').default,

    // /campaign/
    require('./campaign').default,

    // /help/
    require('./searchDefinitions').default,

    // /search/
    require('./search').default,
    require('./searchActions').default,
    require('./searchCampaigns').default,

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    require('./notFound').default,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - www.uprise.org`;
    route.description = route.description || '';

    return route;
  },

};
