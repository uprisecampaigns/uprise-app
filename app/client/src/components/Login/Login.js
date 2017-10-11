import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';

import RaisedButton from 'material-ui/RaisedButton';

import { attemptLogin } from 'actions/AuthActions';

import history from 'lib/history';

import Link from 'components/Link';

import s from 'styles/Form.scss';

import LoginForm from './components/LoginForm';


class Login extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loginError: PropTypes.string,
    message: PropTypes.string,
    handleSignupClick: PropTypes.func,
  }

  static defaultProps = {
    handleSignupClick: (event) => {
      (typeof event.preventDefault === 'function') && event.preventDefault();
      history.push('/signup');
    },
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
      <div className={s.loginContainer}>
        <div className={s.signupButton}>
          <RaisedButton
            secondary
            label="Sign Up"
            onTouchTap={this.props.handleSignupClick}
          />
        </div>

        <LoginForm
          data={this.state}
          handleInputChange={this.handleInputChange}
          formSubmit={this.formSubmit}
          loginError={this.props.loginError}
          message={this.props.message}
        />

        <Link
          useAhref
          to="/forgot-password"
          className={s.forgotPassword}
        >
          Forgot Password
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.userAuthSession.isLoggedIn,
  loginError: state.userAuthSession.error,
  message: state.userAuthSession.message,
});


export default connect(mapStateToProps)(Login);
