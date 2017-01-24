import fetch from 'isomorphic-fetch';
import history from 'lib/history';


export const CLICKED_SIGNUP = 'CLICKED_SIGNUP';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAIL = 'SIGNUP_FAIL';

export const CLICKED_LOGIN = 'CLICKED_LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const STARTED_SESSION_CHECK = 'STARTED_SESSION_CHECK';
export const CHECKED_SESSION_STATUS = 'CHECKED_SESSION_STATUS';

export const CLICKED_LOGOUT = 'CLICKED_LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';


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
  return async (dispatch) => {
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
      dispatch(signupFail(json.err));
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
  return async (dispatch) => {
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
        history.push('/');
        dispatch(loginSuccess(json));
      } else {
        dispatch(loginFail(json.error));
      }

    } catch(err) {
      console.log(err);
      dispatch(loginFail(json.err));
    }
  }
}

export function startedSessionCheck() {
  return { type: STARTED_SESSION_CHECK };
}

export function checkedSessionStatus(result) {
  return { type: CHECKED_SESSION_STATUS, result };
}

export function checkSessionStatus() {
  return async (dispatch) => {

    try {
      dispatch(startedSessionCheck());

      const response = await fetch('/api/checkSession', {
        method: 'POST',
        credentials: 'include',
        body: {},
        headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
      });

      const json = await response.json();

      if (!json.error) {
        dispatch(checkedSessionStatus(json));
      } else {
        // TODO: error handler
        console.error(json.error);
        dispatch(checkedSessionFailure(json.error));
      }

    } catch(err) {
      // TODO: error handler
      console.error(err);
      dispatch(checkedSessionFailure(err));
    }
  }
}

export function clickedLogout() {
  return { type: CLICKED_LOGOUT }; 
}

export function logoutSuccess() {
  return { type: LOGOUT_SUCCESS };
}

export function attemptLogout(){
  return async (dispatch) => {

    try {
      dispatch(clickedLogout());

      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
        body: {},
        headers: {
          'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
      });

      const json = await response.json();

      if (!json.error) {
        dispatch(logoutSuccess());
      } else {
        // TODO: error handler
        console.error(json.error);
        dispatch(logoutFailure(json.error));
      }
    } catch(err) {
      // TODO: error handler
      console.error(err);
      dispatch(logoutFailure(err));
    }
  }
}
