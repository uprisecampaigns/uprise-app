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
    require('./settings').default,

    // TODO: probably want to sub-organize children url
    // /communications/
    require('./communications').default,
    require('./notifications').default,
    require('./requests').default,
    require('./messages').default,

    // /calendar/
    require('./calendar').default,
    require('./viewCalendar').default,
    require('./viewList').default,

    // /organize/
    require('./organize').default,
    require('./viewAllOrganize').default,
    require('./createCampaign').default,

    // /search/
    require('./search').default,
    require('./searchOpportunities').default,

    // /opportunity/
    require('./opportunity').default,

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
