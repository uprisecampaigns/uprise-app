import fetch from 'isomorphic-fetch';
import history from 'lib/history';


export const Clicked_Signup = 'Clicked_Signup';
export const Signup_Success = 'Signup_Success';
export const Signup_Fail = 'Signup_Fail';

export const Clicked_Login = 'Clicked_Login';
export const Login_Success = 'Login_Success';
export const Login_Fail = 'Login_Fail';

export const Started_Session_Check = 'Started_Session_Check';
export const Checked_Session_Status = 'Checked_Session_Status';

export const Clicked_Logout = 'Clicked_Logout';
export const Logout_Success = 'Logout_Success';

// Note: Considered creating a new actions file for navigation
//				related actions. For now, will leave these here.
export const Navigate_Away_From_Auth_Form = 'Navigate_Away_From_Auth_Form';


/*
 * action creators
 */

export function clickedSignup() {
	return { type: Clicked_Signup }
}

export function signupSuccess(userObject) {
	return { type: Signup_Success, userObject };
}

export function signupFail(error) {
	return { type: Signup_Fail, error };
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
        history.push('/');
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
	return { type: Clicked_Login };
}

export function loginSuccess(userObject) {
	return { type: Login_Success, userObject };
}

export function loginFail(error) {
	return { type: Login_Fail, error };
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
	return { type: Started_Session_Check };
}

export function checkedSessionStatus(result) {
	return { type: Checked_Session_Status, result };
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
	return { type: Clicked_Logout }; 
}

export function logoutSuccess() {
	return { type: Logout_Success };
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
        dispatch(logoutFailure(json.error));
      }

    } catch(err) {
      // TODO: error handler
      dispatch(logoutFailure(err));
    }
  }
}


export function navigatedAwayFromAuthFormPage() {
	return { type: Navigate_Away_From_Auth_Form }
}
