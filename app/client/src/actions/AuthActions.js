import fetch from 'isomorphic-fetch';
import history from 'lib/history';
import apolloClient from 'store/apolloClient';


export const CLICKED_SIGNUP = 'CLICKED_SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAIL = 'SIGNUP_FAIL';

export const CLICKED_LOGIN = 'CLICKED_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const CLICKED_CHANGE_PASSWORD = 'CLICKED_CHANGE_PASSWORD';
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS';
export const CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL';

export const CLICKED_RESET_PASSWORD = 'CLICKED_RESET_PASSWORD';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAIL = 'RESET_PASSWORD_FAIL';

export const STARTED_SESSION_CHECK = 'STARTED_SESSION_CHECK';
export const CHECKED_SESSION_STATUS = 'CHECKED_SESSION_STATUS';
export const SESSION_CHECK_FAIL = 'SESSION_CHECK_FAIL';

export const CLICKED_LOGOUT = 'CLICKED_LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAIL = 'LOGOUT_FAIL';


export function clickedSignup() {
  return { type: CLICKED_SIGNUP }
}

export function signupSuccess(userObject) {
  history.push('/welcome');
  return { type: SIGNUP_SUCCESS, userObject };
}

export function signupFail(error) {
  return { type: SIGNUP_FAIL, error };
}

export function attemptSignup(data) {
  return async (dispatch, getState) => {
    if (!getState().userAuthSession.fetchingAuthUpdate) {
      try {
        dispatch(clickedSignup());

        const response = await fetch('/api/signup', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        // TODO: passportjs local-signup/login returns a "missing credentials" 
        // message with no explicit error 
        if (!json.error) {
          dispatch(signupSuccess(json));
        } else {
          dispatch(signupFail(json.error));
        }

      } catch(err) {
        console.log(err);
        dispatch(signupFail(err));
      }
    }
  }
}

export function clickedLogin() {
  return { type: CLICKED_LOGIN };
}

export function loginSuccess(userObject) {
  return { type: LOGIN_SUCCESS, userObject };
}

export function loginFail(error) {
  return { type: LOGIN_FAIL, error };
}

export function attemptLogin(data) {
  return async (dispatch, getState) => {
    if (!getState().userAuthSession.fetchingAuthUpdate) {
      try {
        dispatch(clickedLogin());

        const response = await fetch('/api/login', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        // TODO: passportjs local-signup/login returns a "missing credentials" 
        // message with no explicit error 
        if (!json.error) {
          history.push('/search');
          dispatch(loginSuccess(json));
        } else {
          dispatch(loginFail(json.error));
        }

      } catch(err) {
        console.log(err);
        dispatch(loginFail(err));
      }
    }
  }
}

export function startedSessionCheck() {
  return { type: STARTED_SESSION_CHECK };
}

export function checkedSessionStatus(result) {
  return { type: CHECKED_SESSION_STATUS, result };
}

export function sessionCheckFail(error) {
  return { type: SESSION_CHECK_FAIL, error };
}

export function checkSessionStatus() {
  return async (dispatch, getState) => {

    if (!getState().userAuthSession.fetchingAuthUpdate) {
      try {
        dispatch(startedSessionCheck());

        const response = await fetch('/api/checkSession', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({}),
          headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        if (!json.error) {
          dispatch(checkedSessionStatus(json));
        } else {
          // TODO: error handler
          console.error(json.error);
          dispatch(sessionCheckFail(json.error));
        }

      } catch(err) {
        // TODO: error handler
        console.error(err);
        dispatch(sessionCheckFail(err));
      }
    }
  }
}

export function clickedLogout() {
  return { type: CLICKED_LOGOUT }; 
}

export function logoutSuccess() {
  return { type: LOGOUT_SUCCESS };
}

export function logoutFail() {
  return { type: LOGOUT_FAIL, error };
}

export function attemptLogout(){
  return async (dispatch, getState) => {

    if (!getState().userAuthSession.fetchingAuthUpdate) {
      try {
        dispatch(clickedLogout());

        const response = await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({}),
          headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        if (!json.error) {

          apolloClient.resetStore();
          dispatch(logoutSuccess());
        } else {
          // TODO: error handler
          console.error(json.error);
          dispatch(logoutFail(json.error));
        }
      } catch(err) {
        // TODO: error handler
        console.error(err);
        dispatch(logoutFail(err));
      }
    }
  }
}

export function clickedChangePassword() {
  return { type: CLICKED_CHANGE_PASSWORD }; 
}

export function changePasswordSuccess(message) {
  return { type: CHANGE_PASSWORD_SUCCESS, message };
}

export function changePasswordFail(error) {
  return { type: CHANGE_PASSWORD_FAIL, error };
}

export function attemptChangePassword(data){
  return async (dispatch, getState) => {

    if (!getState().userAuthSession.fetchingAuthUpdate) {
      try {
        dispatch(clickedChangePassword());

        const response = await fetch('/api/change-password', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
          }),
          headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        if (!json.error) {
          history.push('/');
          dispatch(changePasswordSuccess(json));
        } else {
          // TODO: error handler
          console.error(json.error);
          dispatch(changePasswordFail(json.error));
        }
      } catch(err) {
        // TODO: error handler
        console.error(err);
        dispatch(changePasswordFail(err));
      }
    }
  }
}
export function clickedResetPassword() {
  return { type: CLICKED_RESET_PASSWORD }; 
}

export function resetPasswordSuccess(message) {
  return { type: RESET_PASSWORD_SUCCESS, message };
}

export function resetPasswordFail(error) {
  return { type: RESET_PASSWORD_FAIL, error };
}

export function attemptResetPassword(data){
  return async (dispatch, getState) => {

    if (!getState().userAuthSession.fetchingAuthUpdate) {
      try {
        dispatch(clickedResetPassword());

        const response = await fetch('/api/reset-password', {
          method: 'POST',
          credentials: 'include',
          body: JSON.stringify({
            email: data.email
          }),
          headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/json',
          },
        });

        const json = await response.json();

        if (!json.error) {
          history.push('/login');
          dispatch(resetPasswordSuccess(json));
        } else {
          // TODO: error handler
          console.error(json.error);
          dispatch(resetPasswordFail(json.error));
        }
      } catch(err) {
        // TODO: error handler
        console.error(err);
        dispatch(resetPasswordFail(err));
      }
    }
  }
}
