/* eslint-disable import/prefer-default-export */

import { SET_ROLE, SET_BROWSE } from 'actions/PageNavActions';

export const defaultStartState = {
  role: 'volunteer',
  browse: 'events',
};

export function updatePageNav(navState = defaultStartState, action) {
  switch (action.type) {
    case SET_ROLE: {
      return { ...navState, role: action.value };
    }

    case SET_BROWSE: {
      return { ...navState, browse: action.value };
    }

    default: {
      return navState;
    }
  }
}
