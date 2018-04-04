/* eslint-disable import/prefer-default-export */

import { SET_ROLE } from 'actions/PageNavActions';

export const defaultStartState = {
  role: 'volunteer',
};

export function updatePageNav(navState = defaultStartState, action) {
  switch (action.type) {
    case SET_ROLE: {
      return { ...navState, role: action.value };
    }

    default: {
      return navState;
    }
  }
}
