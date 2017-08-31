/* eslint-disable import/prefer-default-export */

import {
  PROMPT_LOGIN, HIDE_LOGIN_PROMPT,
  NOTIFY, CLEAR,
  START_PAGE_LOAD, END_PAGE_LOAD,
  FORM_CLEANED, FORM_DIRTIED,
  ATTEMPT_NAV_FROM_DIRTY_FORM,
  CONFIRM_NAV_FROM_DIRTY_FORM,
  CANCEL_NAV_FROM_DIRTY_FORM,
} from 'actions/NotificationsActions';

const defaultStartState = {
  loginModal: {
    display: false,
    title: 'Please sign up or log in to view this content.',
    exitable: false,
  },
  display: false,
  message: '',
  pageLoading: false,
  formStateClean: true,
  displayFormNavWarning: false,
};

export function updateNotifications(notificationsState = defaultStartState, action) {
  switch (action.type) {
    case PROMPT_LOGIN:
      return Object.assign({}, notificationsState, {
        loginModal: {
          display: true,
          title: (typeof action.title === 'string') ? action.title : notificationsState.loginModal.title,
          exitable: (typeof action.exitable === 'boolean') ? action.exitable : notificationsState.loginModal.exitable,
        },
      });

    case HIDE_LOGIN_PROMPT:
      return Object.assign({}, notificationsState, {
        loginModal: defaultStartState.loginModal,
      });

    case NOTIFY:
      return Object.assign({}, notificationsState, {
        display: true,
        message: action.value,
      });

    case CLEAR:
      return Object.assign({}, notificationsState, {
        display: false,
        message: '',
      });

    case START_PAGE_LOAD:
      return Object.assign({}, notificationsState, {
        pageLoading: true,
      });

    case END_PAGE_LOAD:
      return Object.assign({}, notificationsState, {
        pageLoading: false,
      });

    case FORM_CLEANED:
      return Object.assign({}, notificationsState, {
        formStateClean: true,
        displayFormNavWarning: false,
        nextUrl: undefined,
      });

    case FORM_DIRTIED:
      return Object.assign({}, notificationsState, {
        formStateClean: false,
      });

    case ATTEMPT_NAV_FROM_DIRTY_FORM:
      return Object.assign({}, notificationsState, {
        nextUrl: action.nextUrl,
        displayFormNavWarning: true,
      });

    case CANCEL_NAV_FROM_DIRTY_FORM:
      return Object.assign({}, notificationsState, {
        displayFormNavWarning: false,
        nextUrl: undefined,
      });

    case CONFIRM_NAV_FROM_DIRTY_FORM:
      return Object.assign({}, notificationsState, {
        formStateClean: true,
        nextUrl: undefined,
        displayFormNavWarning: false,
      });

    default:
      return notificationsState;
  }
}
