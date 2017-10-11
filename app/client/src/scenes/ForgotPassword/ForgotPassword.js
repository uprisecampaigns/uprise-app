import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import history from 'lib/history';

import { attemptResetPassword } from 'actions/AuthActions';

import ResetPasswordForm from './components/ResetPasswordForm';

class ForgotPassword extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    resetError: PropTypes.string,
  }

  static defaultProps = {
    resetError: undefined,
  }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailErrorText: null,
    };
  }

  hasErrors = false

  handleInputChange = (event, type, value) => {
    this.setState(Object.assign(
      {},
      this.state,
      { [type]: value },
    ));
  }

  // TODO: this is used in SignupForm as well - DRY it out
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

  formSubmit = (event) => {
    event.preventDefault();
    this.hasErrors = false;

    this.validateEmail();

    if (!this.hasErrors) {
      this.props.dispatch(attemptResetPassword({
        email: this.state.email,
      }));
    }
  }

  cancelReset = (event) => {
    event.preventDefault();
    history.push('/login');
  }

  render() {
    return (
      <ResetPasswordForm
        data={this.state}
        handleInputChange={this.handleInputChange}
        cancelReset={this.cancelReset}
        formSubmit={this.formSubmit}
        resetError={this.props.resetError}
      />
    );
  }
}

const mapStateToProps = state => ({
  resetError: state.userAuthSession.error,
});


export default connect(mapStateToProps)(ForgotPassword);
