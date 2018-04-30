/* eslint-disable global-require */

import { setRole } from 'actions/PageNavActions';

export default {

  path: '/account',

  async action({ store, next }) {
    store.dispatch(setRole('user'));

    const route = await next();
    return route;
  },

  children: [
    {
      path: '',
      action: () => ({
        redirect: '/account/view-profile',
      }),
    },
    require('./settings').default,
    require('./contact').default,
    require('./privacySecurity').default,
    require('./confirmEmail').default,
    require('./viewProfile').default,
    require('./editProfile').default,
  ],
};
