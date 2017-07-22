import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';

import { attemptLogin } from 'actions/AuthActions';

import LoginForm from './components/LoginForm';


class LoginFormContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginError: PropTypes.string,
    message: PropTypes.string,
  }

  static defaultProps = {
    message: undefined,
    loginError: undefined,
  }

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailErrorText: null,
      passwordErrorText: null,
    };
  }

  hasErrors = false

  handleInputChange = (event, type, value) => {
    this.setState(Object.assign({},
      this.state,
      { [type]: value },
    ));
  }

  // TODO: this is used in SignupForm as well - DRY it out
  validateString = (prop, errorProp, errorMsg) => {
    if (typeof this.state[prop] !== 'string' ||
        this.state[prop].trim() === '') {
      this.setState({
        [errorProp]: errorMsg,
      });

      this.hasErrors = true;
    } else {
      this.setState({
        [errorProp]: null,
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
        emailErrorText: 'Please enter a valid email',
      });
      this.hasErrors = true;
    }
  }

  formSubmit = (event) => {
    event.preventDefault();
    this.hasErrors = false;

    this.validateEmail();
    this.validateString('password', 'passwordErrorText', 'Password is Required');

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

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  loginError: state.userAuthSession.error,
  message: state.userAuthSession.message,
});


export default connect(mapStateToProps)(LoginFormContainer);
