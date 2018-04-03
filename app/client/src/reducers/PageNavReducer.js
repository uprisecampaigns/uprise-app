/* eslint-disable import/prefer-default-export */

import { SET_PAGE } from 'actions/PageNavActions';

export const defaultStartState = {};

export const defaultHomeNavStartState = {
  ...defaultStartState,
  page: 'action',
};

export const defaultRoleNavStartState = {
  ...defaultStartState,
  page: 'volunteer',
};

export function updatePageNav(navState = defaultStartState, action) {
  switch (action.type) {
    case SET_PAGE: {
      return { ...navState, page: action.value };
    }

    default: {
      return navState;
    }
  }
}
