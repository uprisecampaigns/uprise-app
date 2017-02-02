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
    // require('./privacy').default,
    // require('./admin').default,

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