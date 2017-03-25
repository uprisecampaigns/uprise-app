export default {

  path: '/',


  // Routes are evaluated in order
  children: [
    require('./home').default,
    require('./about').default,
    require('./login').default,
    require('./signup').default,
    require('./forgotPassword').default,
    require('./changePassword').default,
    require('./welcome').default,

    // TODO: probably want to sub-organize children url
    // /communications/
    require('./communications').default,
    require('./notifications').default,
    require('./requests').default,
    require('./messages').default,

    // /calendar/
    require('./calendar').default,
    require('./viewCalendar').default,
    require('./viewCalendarList').default,

    // /organize/
    require('./organize').default,
    require('./createCampaign').default,

    // /organize/:slug/
    require('./manageCampaign').default,
    require('./manageCampaignSettings').default,
    require('./manageCampaignProfile').default,
    require('./manageCampaignInfo').default,
    require('./manageCampaignPreferences').default,
    require('./manageCampaignLocation').default,
    require('./manageCampaignActions').default,
    require('./manageCampaignActionsList').default,
    require('./createAction').default,

    // /organize/:campaignSlug/action/:actionSlug
    require('./manageAction').default,
    require('./manageActionSettings').default,
    require('./manageActionInfo').default,

    // /search/
    require('./search').default,
    require('./searchActions').default,
    require('./searchCampaigns').default,

    // /action/
    require('./action').default,

    // /campaign/
    require('./campaign').default,

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
