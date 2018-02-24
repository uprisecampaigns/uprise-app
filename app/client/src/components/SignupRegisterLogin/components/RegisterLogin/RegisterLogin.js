import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';

import { attemptSignup, attemptLogin } from 'actions/AuthActions';

import formWrapper from 'lib/formWrapper';

import {
  validateString,
  validateZipcode,
  validateEmail,
  validateEmailAvailable,
  validatePasswords,
} from 'lib/validateComponentForms';

import Terms from 'components/Terms';
import RegisterLoginForm from './components/RegisterLoginForm';

const WrappedRegisterLoginForm = formWrapper(RegisterLoginForm);

export class RegisterLogin extends Component {
  static propTypes = {
    termsContent: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    signupError: PropTypes.string.isRequired,
    formType: PropTypes.string,
  }

  static defaultProps = {
    formType: 'register',
  }

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      formType: props.formType,
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password1: '',
        password2: '',
        zipcode: '',
      },
    };
  }

  setFormType = (formType) => {
    this.setState({
      formType,
    });
  }

  formSubmit = async (data) => {
    if (this.state.formType === 'register' && this.state.page === 0) {
      this.setState({
        formData: Object.assign({}, data),
        page: 1,
      });
    } else {
      this.props.dispatch(attemptLogin({
        email: data.email,
        password: data.password,
      }));

      return { success: true, message: false };
    }

    return { success: true, message: 'Please enter name and zipcode to continue' };
  }

  defaultErrorText = {
    firstNameErrorText: null,
    lastNameErrorText: null,
    zipcodeErrorText: null,
    emailErrorText: null,
  }

  agreeToTerms = (event) => {
    this.props.dispatch(attemptSignup({
      email: this.state.formData.email,
      firstName: this.state.formData.firstName,
      lastName: this.state.formData.lastName,
      zipcode: this.state.formData.zipcode,
      phoneNumber: this.state.formData.phoneNumber,
      password: this.state.formData.password1,
    }));
  }

  render() {
    const { page, formType } = this.state;

    const registerValidators = page === 0 ? [
      component => validateString(component, 'email', 'emailErrorText', 'Please enter an email'),
      component => validateString(component, 'password1', 'password1ErrorText', 'Please enter a password'),
      component => validatePasswords(component, 'password1', 'password2', 'password1ErrorText', 'password2ErrorText'),
      component => validateEmail(component),
      component => validateEmailAvailable(component),
    ] : [
      component => validateString(component, 'firstName', 'firstNameErrorText', 'First Name is Required'),
      component => validateString(component, 'lastName', 'lastNameErrorText', 'Last Name is Required'),
      component => validateString(component, 'zipcode', 'zipcodeErrorText', 'Please enter a zipcode'),
      component => validateZipcode(component),
    ];

    const loginValidators = [
      component => validateString(component, 'email', 'emailErrorText', 'Please enter an email'),
      component => validateEmail(component),
      component => validateString(component, 'password', 'passwordErrorText', 'Please enter a password'),
    ];

    const validators = formType === 'register' ? registerValidators : loginValidators;

    if (this.state.page === 2) {
      return (
        <Terms
          agreeToTerms={this.agreeToTerms}
          cancel={event => this.setState({ page: 0 })}
          content={this.props.termsContent}
        />
      );
    }

    return (
      <WrappedRegisterLoginForm
        initialState={this.state.formData}
        initialErrors={this.defaultErrorText}
        forceRefresh={false}
        validators={validators}
        submit={this.formSubmit}
        setFormType={this.setFormType}
        signupError={this.props.signupError}
        page={page}
        formType={formType}
      />
    );
  }
}

const RegisterLoginWithApollo = withApollo(RegisterLogin);

const mapStateToProps = state => ({
  signupError: state.userAuthSession.error,
  loggedIn: state.userAuthSession.isLoggedIn,
});


export default connect(mapStateToProps)(RegisterLoginWithApollo);
