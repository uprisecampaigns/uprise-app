import ConfirmEmailMutation from 'schemas/mutations/ConfirmEmailMutation.graphql';

import { notify } from 'actions/NotificationsActions';

let redirectURL = '/';
export default {
  path: '/settings/confirm-email/:token',

  async action(context) {
    try {
      const { token } = context.params;
      const result = await context.apolloClient.mutate({
        mutation: ConfirmEmailMutation,
        variables: { token },
      });

      if (result.data.confirmEmail) {
        context.store.dispatch(notify('Email successfully confirmed'));
        redirectURL = '/confirmed';
      } else {
        context.store.dispatch(notify('There was an error confirming your email. Please try again.'));
      }
    } catch (e) {
      console.error(e);
      context.store.dispatch(notify('There was an error confirming your email. Please try again.'));
    }

    return { redirect: redirectURL };
  },
};
