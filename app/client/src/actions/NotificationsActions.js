import history from 'lib/history';

export const NOTIFY = 'NOTIFY';
export const CLEAR = 'CLEAR';

export const START_PAGE_LOAD = 'START_PAGE_LOAD';
export const END_PAGE_LOAD = 'END_PAGE_LOAD';

export const FORM_DIRTIED = 'FORM_DIRTIED';
export const FORM_CLEANED = 'FORM_CLEANED';

export const ATTEMPT_NAV_FROM_DIRTY_FORM = 'ATTEMPT_NAV_FROM_DIRTY_FORM';
export const CONFIRM_NAV_FROM_DIRTY_FORM = 'CONFIRM_NAV_FROM_DIRTY_FORM';
export const CANCEL_NAV_FROM_DIRTY_FORM = 'CANCEL_NAV_FROM_DIRTY_FORM';

export const notify = value => ({ type: NOTIFY, value });

export const clear = () => ({ type: CLEAR });

export const startPageLoad = () => ({ type: START_PAGE_LOAD });

export const endPageLoad = () => ({ type: END_PAGE_LOAD });

export const dirtyForm = () => ({ type: FORM_DIRTIED });

export const cleanForm = () => ({ type: FORM_CLEANED });

export const cancelNavFromDirtyForm = () => ({ type: CANCEL_NAV_FROM_DIRTY_FORM });

export const attemptNavFromDirtyForm = nextUrl => ({ type: ATTEMPT_NAV_FROM_DIRTY_FORM, nextUrl });

export const confirmNavFromDirtyForm = () => async (dispatch, getState) => {
  const nextUrl = getState().notifications.nextUrl;

  dispatch(cleanForm());

  history.push(nextUrl);

  return { type: CONFIRM_NAV_FROM_DIRTY_FORM };
};
