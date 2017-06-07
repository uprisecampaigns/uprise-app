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

export const notify = (value) => {
  return { type: NOTIFY, value };
};

export const clear = () => {
  return { type: CLEAR };
};

export const startPageLoad = () => {
  return { type: START_PAGE_LOAD };
};

export const endPageLoad = () => {
  return { type: END_PAGE_LOAD };
};

export const dirtyForm = () => {
  return { type: FORM_DIRTIED };
};

export const cleanForm = () => {
  return { type: FORM_CLEANED };
};

export const cancelNavFromDirtyForm = () => {
  return { type: CANCEL_NAV_FROM_DIRTY_FORM };
};

export const attemptNavFromDirtyForm = (nextUrl) => {
  return { type: ATTEMPT_NAV_FROM_DIRTY_FORM, nextUrl };
};

export const confirmNavFromDirtyForm = () => {
  return async (dispatch, getState) => {

    const nextUrl = getState().notifications.nextUrl;

    dispatch(cleanForm());

    history.push(nextUrl);

    return { type: CONFIRM_NAV_FROM_DIRTY_FORM };
  }
};
