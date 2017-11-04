export const PRESSED_SIGNUP = 'PRESSED_SIGNUP';
export const CLOSED_MODAL = 'CLOSED_MODAL';

export const pressedSignup = action => ({ type: PRESSED_SIGNUP, action });
export const closedModal = () => ({ type: CLOSED_MODAL });
