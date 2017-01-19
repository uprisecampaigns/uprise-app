import fetch from 'isomorphic-fetch';


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

      console.log(response);

      const json = await response.json();

      console.log(json);

    } catch(err) {
      console.log(err);
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


export function attemptLogin(email, password) {
  return (dispatch) => {
    dispatch(clickedLogin());

    $.ajax({
			type: 'POST',
			url: '/login',
			data: {email, password} })
			.done(function(data) {
				if (data.error){
					dispatch(loginFail(data.error));
				} else {
					dispatch(loginSuccess(data));
				}
			})
			.fail(function(a,b,c,d) {
			  // console.log('failed to login',a,b,c,d);
			  dispatch(loginFail("TODO find the error..."));
			});
  }
}


export function startedSessionCheck() {
	return { type: Started_Session_Check };
}

export function checkedSessionStatus(result) {
	return { type: Checked_Session_Status, result };
}

export function checkSessionStatus(email, password) {
  return (dispatch) => {
    dispatch(startedSessionCheck());

    $.ajax({
			type: 'POST',
			url: '/checkSession',
			data: {} })
			.done(function(result) {
				dispatch(checkedSessionStatus(result));
			})
			.fail(function(a,b,c,d) {
			  // console.log('failed to check',a,b,c,d);
			  dispatch(checkedSessionStatus("TODO find the error..."));
			});
  }
}


export function clickedLogout() {
	return { type: Clicked_Logout }; 
}

export function logoutSuccess() {
	return { type: Logout_Success };
}

export function attemptLogout(){
  return (dispatch) => {
    dispatch(clickedLogout());

    $.ajax({
	      type: 'POST',
	      url: '/logout'})
			  .done(function() {
					dispatch(logoutSuccess());
			  })
			  .fail(function() {
			  	// Not the redux way, but I think it's fair enough.
			    alert("Can't log you out at the moment. Try again in a bit");
			  });
  }
}


export function navigatedAwayFromAuthFormPage() {
	return { type: Navigate_Away_From_Auth_Form }
}
