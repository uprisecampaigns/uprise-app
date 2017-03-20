import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import isEmail from 'validator/lib/isEmail';

import { attemptLogin } from 'actions/AuthActions';

import LoginForm from './components/LoginForm';


class LoginFormContainer extends Component {
  constructor(props) {
    super(props);
  }

  hasErrors = false

  state = {
    email: '',
    password: '',
    emailErrorText: null,
    passwordErrorText: null,
  }
 
  handleInputChange = (event, type, value) => {
    this.setState(Object.assign({},
      this.state,
      { [type]: value }
    ));
  }

  // TODO: this is used in SignupForm as well - DRY it out
  validateString = (prop, errorProp, errorMsg) => {
    if (typeof this.state[prop] !== 'string' || 
        this.state[prop].trim() === '') {

      this.setState({ 
        [errorProp]: errorMsg 
      });

      this.hasErrors = true;

    } else {
      this.setState({ 
        [errorProp]: null 
      });
    }
  }

  validateEmail = () => {
    this.setState({
      emailErrorText: null,
    });

    this.validateString('email', 'emailErrorText', 'Email is Required');

    if (typeof this.state.email === 'string' &&
        !isEmail(this.state.email)) {

      this.setState({
        emailErrorText: 'Please enter a valid email'
      });
      this.hasErrors = true;
    }
  }

  formSubmit = (event) => {
    console.log(event);
    event.preventDefault();
    this.hasErrors = false;

    this.validateEmail();
    this.validateString('password', 'passwordErrorText', 'Password is Required');
    console.log(this.state);

    if (!this.hasErrors) {
      this.props.dispatch(attemptLogin({
        email: this.state.email,
        password: this.state.password,
      }));
    }
  }

  render() {
    return (
      <LoginForm
        data={this.state}
        handleInputChange={this.handleInputChange}
        formSubmit={this.formSubmit}
        loginError={this.props.loginError}
        message={this.props.message}
      /> 
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.userAuthSession.isLoggedIn,
    loginError: state.userAuthSession.error,
    message: state.userAuthSession.message
  };
}


export default connect(mapStateToProps)(LoginFormContainer);
