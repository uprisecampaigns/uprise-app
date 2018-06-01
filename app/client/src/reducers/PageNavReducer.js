/* eslint-disable import/prefer-default-export */

import { SET_ROLE, SET_PAGE } from 'actions/PageNavActions';

export const defaultStartState = {
  ...defaultStartState,
  page: 'action',
  role: 'volunteer',
};

export function updatePageNav(navState = defaultStartState, action) {
  switch (action.type) {

    case SET_ROLE: {
      return { ...navState, role: action.value };
    }
    case SET_PAGE: {
      return { ...navState, page: action.value };
    }

    default: {
      return navState;
    }
  }
}
