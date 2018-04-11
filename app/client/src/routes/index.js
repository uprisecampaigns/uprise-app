/* eslint-disable global-require */

import { setRole } from 'actions/PageNavActions';

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

    // /organize/
    require('./organize').default,

    // /volunteer/
    require('./volunteer').default,
    require('./actionCommitments').default,
    require('./campaignSubscriptions').default,

    // /opportunity/
    require('./action').default,

    // /campaign/
    require('./campaign').default,

    // /user/
    require('./userProfile').default,
    require('./messageUser').default,

    // /help/
    require('./searchDefinitions').default,

    // /browse/
    require('./browse').default,

    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    require('./notFound').default,
  ],

  async action({ store, next }) {
    // Assume role is volunteer unless route sets otherwise
    store.dispatch(setRole('volunteer'));

    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.pageTitle = route.title || 'Untitled Page';
    route.title = `${route.pageTitle} - UpRise.org`;
    // eslint-disable-next-line max-len
    route.description = route.description || 'Sign up now to find volunteering opportunities or create a page so volunteers can find you. UpRise is reforming our political campaign process by putting you back in the drivers’ seat.';

    return route;
  },

};
