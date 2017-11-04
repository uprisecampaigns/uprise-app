/* eslint-disable import/prefer-default-export */

import { PRESSED_SIGNUP, CLOSED_MODAL } from 'actions/ActionSignupActions';

export const defaultStartState = {
  modalOpen: false,
  action: undefined,
};


export function updateActionSignup(signupState = defaultStartState, action) {
  switch (action.type) {
    case PRESSED_SIGNUP: {
      return { 
        ...signupState, 
        action: action.action,
        modalOpen: true,
      };
    }

    case CLOSED_MODAL: {
      return { ...signupState, modalOpen: false };
    }

    default: {
      return signupState;
    }
  }
}
